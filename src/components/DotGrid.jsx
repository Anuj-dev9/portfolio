import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './DotGrid.css';

const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 1.5,
  gap = 20,
  baseColor = '#ffffff',
  activeColor = '#E8A838', // updated to apex amber
  proximity = 120,
  speedTrigger = 100,
  maxSpeed = 2000,
  resistance = 500,
  returnDuration = 0.8,
  className = '',
  style = {}
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const { width, height } = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cols = Math.floor(width / (dotSize + gap));
    const rows = Math.floor(height / (dotSize + gap));

    const offX = (width - cols * (dotSize + gap) + gap) / 2;
    const offY = (height - rows * (dotSize + gap) + gap) / 2;

    const newDots = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = offX + i * (dotSize + gap) + dotSize / 2;
        const cy = offY + j * (dotSize + gap) + dotSize / 2;
        newDots.push({
          cx,
          cy,
          xOffset: 0,
          yOffset: 0,
          opacity: 0.15,
          color: { ...baseRgb },
          _inertiaApplied: false
        });
      }
    }
    dotsRef.current = newDots;
  }, [dotSize, gap, baseRgb]);

  useEffect(() => {
    buildGrid();
    const handleResize = throttle(buildGrid, 200);
    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pr = pointerRef.current;

      for (const dot of dotsRef.current) {
        const dx = dot.cx - pr.x;
        const dy = dot.cy - pr.y;
        const dist = Math.hypot(dx, dy);

        let r = baseRgb.r,
          g = baseRgb.g,
          b = baseRgb.b,
          a = 0.3; // Increased base opacity

        if (dist < proximity) {
          const f = 1 - dist / proximity;
          r = baseRgb.r + (activeRgb.r - baseRgb.r) * f;
          g = baseRgb.g + (activeRgb.g - baseRgb.g) * f;
          b = baseRgb.b + (activeRgb.b - baseRgb.b) * f;
          a = 0.3 + 0.7 * f; // Peaks at 1.0 opacity
        }

        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
        ctx.beginPath();
        ctx.arc(dot.cx + dot.xOffset, dot.cy + dot.yOffset, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };

    render();

    const onMove = (e) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = (dot.cx - pr.x) + vx * 0.005;
          const pushY = (dot.cy - pr.y) + vy * 0.005;

          // Replaced premium InertiaPlugin with standard gsap.to
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1, 0.75)'
              });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    };

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [
    buildGrid,
    dotSize,
    proximity,
    baseRgb,
    activeRgb,
    speedTrigger,
    maxSpeed,
    resistance,
    returnDuration
  ]);

  return (
    <div ref={wrapperRef} className={`dot-grid-container ${className}`} style={style}>
      <canvas ref={canvasRef} className="dot-grid__canvas" />
    </div>
  );
};

export default DotGrid;
