import React from "react"
import ReactDOM from "react-dom/client"
import AppRoutes from "./routes"
import { AuthProvider } from "./context/AuthContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
)