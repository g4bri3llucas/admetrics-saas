import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({ children, role }) {
  const { user, perfil, carregando } = useAuth()

  if (carregando) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
      }}>
        <span style={{ color: "#475569", fontSize: "14px" }}>Loading...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />

  if (role && perfil?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}