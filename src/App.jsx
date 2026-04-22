import { Router, Route } from './router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import HomePage       from './pages/HomePage'
import ProjectsPage   from './pages/ProjectsPage'
import Design2DPage   from './pages/Design2DPage'
import GalleryPage    from './pages/GalleryPage'
import Modeling3DPage from './pages/Modeling3DPage'
import AboutPage      from './pages/AboutPage'
import ContactPage    from './pages/ContactPage'

export default function App() {
  return (
    <Router>
      <div className="app">
        <div className="noise-overlay" />
        <Navbar />
        <main>
          <Route path="/"         element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/design"   element={<Design2DPage />} />
          <Route path="/gallery"  element={<GalleryPage />} />
          <Route path="/3d"       element={<Modeling3DPage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/contact"  element={<ContactPage />} />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  )
}
