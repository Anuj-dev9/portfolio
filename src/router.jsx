import { useState, useEffect, createContext, useContext } from 'react'

// ─── Router Context ───────────────────────────────────────────────
const RouterContext = createContext({ path: '/', navigate: () => {} })

export function useRouter() {
  return useContext(RouterContext)
}

// ─── Link Component ───────────────────────────────────────────────
export function Link({ to, className, children, style, ...props }) {
  const { navigate } = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} className={className} style={style} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

// ─── Route Component ──────────────────────────────────────────────
export function Route({ path, element }) {
  const { path: currentPath } = useRouter()
  return currentPath === path ? element : null
}

// ─── Router Provider ──────────────────────────────────────────────
export function Router({ children }) {
  const [path, setPath] = useState(window.location.pathname)

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}
