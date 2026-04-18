import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({ children, role }) {
  const { user, perfil, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <span className="text-gray-400 text-sm">Carregando...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />  

  if (role && perfil?.role !== role) {
    return <Navigate to="/" replace />  
  }

  return children
}