import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Admin from "./pages/admin/Admin"

import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <Admin />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}