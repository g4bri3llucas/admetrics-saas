import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Admin from "./pages/admin/Admin"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}