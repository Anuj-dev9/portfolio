import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState } from 'react';
import { fetchBehanceProjects } from '../services/behanceService';
import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * Loads an image URL and returns an ImageBitmap (or HTMLImageElement fallback)
 * that is safe to use with WebGL texImage2D.
 */
function loadImageBitmap(src) {
  return new Promise((resolve, reject) => {
    // Use createImageBitmap for proper WebGL texture source
    if (typeof createImageBitmap !== 'undefined') {
      fetch(src, { mode: 'cors' })
        .then(r => r.blob())
        .then(b => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }))
        .then(resolve)
        .catch(() => {
          // Fallback to Image element
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }
  });
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'white') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  // Extract font size from font string like 'bold 30px Figtree' — parseInt('bold...') returns NaN
  const fontSizeMatch = font.match(/(\d+)px/);
  const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 30;
  const textHeight = Math.ceil(fontSize * 1.4);
  canvas.width = Math.max(textWidth + 20, 1);
  canvas.height = Math.max(textHeight + 20, 1);
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  return { canvas, width: canvas.width, height: canvas.height };
}

class Media {
  constructor({
    geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.font = font;
    this.createShader();
    this.createMesh();
    // this.createTitle(); // Removed to hide text
    this.onResize();
  }

  createShader() {
    // Create texture with no image — OGL uploads a safe 1x1 empty pixel
    this.texture = new Texture(this.gl, {
      generateMipmaps: false,
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * 0.02;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: this.texture },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
      },
      transparent: true,
    });

    // Load the actual image using createImageBitmap for proper WebGL compat
    if (this.image) {
      loadImageBitmap(this.image)
        .then(imgBmp => {
          this.texture.image = imgBmp;
          // Close ImageBitmap after GPU upload to free memory
          if (imgBmp.close) {
            this.texture.onUpdate = () => {
              imgBmp.close();
              this.texture.onUpdate = null;
            };
          }
        })
        .catch(() => {
          // Silently fail — texture stays as empty pixel
        });
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    if (!this.plane || !this.program) return;

    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    if (this.program && this.program.uniforms) {
      this.program.uniforms.uTime.value += 0.04;
      this.program.uniforms.uSpeed.value = this.speed;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    if (!this.plane) return;

    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;

    this.padding = 0.5;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(container, { items, bend, textColor = '#ffffff', font = 'bold 30px Figtree', scrollSpeed = 2, scrollEase = 0.05 } = {}) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.destroyed = false;

    try {
      this.createRenderer();
      if (!this.gl) throw new Error('WebGL context creation failed');
      this.createCamera();
      this.createScene();
      this.onResize();
      this.createGeometry();
      this.createMedias(items, bend, textColor, font);
      this.update();
      this.addEventListeners();
    } catch (error) {
      console.error('CircularGallery initialization error:', error);
      this.destroyed = true;
      throw error; // Re-throw to be caught by React component
    }
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      preserveDrawingBuffer: true,
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 20, widthSegments: 40 });
  }

  createMedias(items, bend = 1, textColor, font) {
    const defaultItems = [
      { image: 'https://picsum.photos/seed/gallery1/800/600', text: 'Gallery Item 1' },
      { image: 'https://picsum.photos/seed/gallery2/800/600', text: 'Gallery Item 2' },
      { image: 'https://picsum.photos/seed/gallery3/800/600', text: 'Gallery Item 3' },
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        font,
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    if (this.destroyed) return;

    try {
        // Smooth continuous auto-scroll
        this.scroll.target += this.scrollSpeed * 0.02;

        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
        if (this.medias) {
          this.medias.forEach(media => {
              if (media && typeof media.update === 'function') media.update(this.scroll, direction);
          });
        }

        if (this.renderer && typeof this.renderer.render === 'function') {
            this.renderer.render({ scene: this.scene, camera: this.camera });
        }
        this.scroll.last = this.scroll.current;
        this.raf = window.requestAnimationFrame(this.update.bind(this));
    } catch (err) {
        console.error('[CircularGallery] Render loop error:', err);
        this.destroy();
    }
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    window.addEventListener('resize', this.boundOnResize);
  }

  destroy() {
    this.destroyed = true;
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05,
  section = null
}) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [galleryItems, setGalleryItems] = useState(items || []);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    // Check WebGL support once
    if (!isWebGLSupported()) {
        console.warn('[CircularGallery] WebGL is not supported on this device. Falling back to CSS gallery.');
        setWebglError(true);
    }
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      setGalleryItems(items);
      return;
    }

    fetchBehanceProjects().then(projects => {
      if (projects) {
        let filtered = projects;
        if (section) {
          filtered = projects.filter(p => p.portfolioSection === section);
        }
        const mapped = filtered.map(p => ({
          image: `https://wsrv.nl/?url=${encodeURIComponent(p.img)}&w=800&h=600&fit=cover`,
          text: p.title
        }));
        setGalleryItems(mapped);
      }
    }).catch(err => {
      console.error('[CircularGallery] Failed to fetch Behance projects:', err);
      setGalleryItems([]);
    });
  }, [items, section]);

  useEffect(() => {
    if (!containerRef.current || webglError) return;

    if (appRef.current) {
      appRef.current.destroy();
      appRef.current = null;
    }

    let itemsToUse = galleryItems;
    if (!itemsToUse || itemsToUse.length === 0) {
      itemsToUse = [
        { image: 'https://picsum.photos/seed/design1/800/600', text: 'Gallery Item 1' },
        { image: 'https://picsum.photos/seed/design2/800/600', text: 'Gallery Item 2' },
        { image: 'https://picsum.photos/seed/design3/800/600', text: 'Gallery Item 3' },
      ];
    }

    try {
        const app = new App(containerRef.current, {
          items: itemsToUse, bend, textColor, font, scrollSpeed, scrollEase
        });
        appRef.current = app;
    } catch (err) {
        console.error('[CircularGallery] App initialization failed:', err);
        setWebglError(true);
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, [galleryItems, bend, textColor, font, scrollSpeed, scrollEase, webglError]);

  if (webglError) {
    const fallbackItems = galleryItems.length > 0 ? galleryItems : [
        { image: 'https://picsum.photos/seed/design1/800/600', text: 'Gallery Item 1' },
        { image: 'https://picsum.photos/seed/design2/800/600', text: 'Gallery Item 2' },
        { image: 'https://picsum.photos/seed/design3/800/600', text: 'Gallery Item 3' },
    ];
    return (
        <div className="circular-gallery-wrapper">
            <div className="circular-gallery-fallback">
                {fallbackItems.map((item, i) => (
                    <div key={i} className="circular-gallery-fallback-item">
                        <img src={item.image} alt={item.text} className="circular-gallery-fallback-img" />
                        <span className="circular-gallery-fallback-label">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="circular-gallery-wrapper">
      <div className="circular-gallery-container" ref={containerRef} />
    </div>
  );
}
