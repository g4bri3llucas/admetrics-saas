import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { logout } from "../../services/authService"
import { getClientes } from "../../services/clienteService"

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/")
      return
    }

    carregarClientes()
  }, [user])

  async function carregarClientes() {
    try {
      const data = await getClientes()
      setClientes(data)
    } catch (error) {
      console.error("Erro ao carregar clientes", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Painel Admin</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      <h2 className="text-xl mb-4">Clientes</h2>

      <div className="space-y-3">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="border p-3 rounded shadow"
          >
            <p><strong>Nome:</strong> {cliente.nome}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}