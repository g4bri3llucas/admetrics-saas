import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import Dashboard from "./pages/Dashboard"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}