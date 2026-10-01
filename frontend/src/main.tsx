import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Dashboard from "./pages/Dashboard.tsx"
import ProtectedRoutes from "./components/ProtectedRoutes.tsx"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { element: <ProtectedRoutes />, children: 
    [{ 
      path: "/dashboard", element: <Dashboard />
    }]}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="dark min-h-screen bg-background text-foreground">
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
)
