import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const { user, perfil } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && perfil?.role === "admin") {
      navigate("/admin")
    }
  }, [user, perfil])

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    console.log("Clicou em entrar:", email)

    try {
      await login(email, senha)
      // O useEffect acima vai redirecionar após o login
    } catch (error) {
      console.error(error)
      setErro("Email ou senha inválidos.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">AdMetrics</h1>
          <p className="text-slate-500 mt-2">Painel de métricas de campanhas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="********"
              value={senha}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <div className="text-center mt-6 text-sm text-slate-400">
          AdMetrics © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  )
}