import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Dashboard from "./pages/Dashboard.tsx"
import ProtectedRoutes from "./components/ProtectedRoutes.tsx"
import DashboardLayout from "./layouts/DashboardLayout.tsx"
import Organisations from "./pages/Organisations.tsx"
import { ThemeProvider } from "./components/ThemeProvider.tsx"
import Leagues from "./pages/Leagues.tsx"
import League from "./pages/League.tsx"
import Venues from "./pages/Venues.tsx"
import Venue from "./pages/Venue.tsx"
import UsernameLogin from "./pages/EmailLogin.tsx"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/login-secret", element: <UsernameLogin />},
  { element: <ProtectedRoutes />, children: 
    [{ 
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "organisations", element: <Organisations /> },
        { path: "leagues", element: <Leagues /> },
        { path: "leagues/:leagueId", element: <League /> },
        { path: "venues", element: <Venues /> },
        { path: "venues/:venueId", element: <Venue /> },
      ],
    }]}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
