import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    try {
      await login(email, senha)
      navigate("/admin")
    } catch (error) {
      alert("Erro ao fazer login")
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h1 className="text-xl mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 mb-3"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}