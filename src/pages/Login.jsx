import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"
import { useAuth } from "../context/AuthContext"

// Dados fictícios animados para o painel esquerdo
const STATS = [
  { label: "Impressões hoje", value: 284750, unit: "", color: "#38bdf8" },
  { label: "Cliques", value: 18432, unit: "", color: "#34d399" },
  { label: "ROI médio", value: 3.4, unit: "x", color: "#a78bfa" },
  { label: "Campanhas ativas", value: 61, unit: "", color: "#fb923c" },
]

const SPARKLINE_DATA = [42, 58, 45, 70, 63, 88, 75, 95, 82, 110, 98, 124]

function Sparkline({ data, color }) {
  const w = 120, h = 36
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={pts.split(" ").at(-1).split(",")[0]} cy={pts.split(" ").at(-1).split(",")[1]} r="3" fill={color} />
    </svg>
  )
}

function AnimatedNumber({ target, unit, color }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const step = target / 60
    ref.current = setInterval(() => {
      start += step
      if (start >= target) { setCurrent(target); clearInterval(ref.current) }
      else setCurrent(Math.floor(start))
    }, 16)
    return () => clearInterval(ref.current)
  }, [target])

  const display = unit === "x"
    ? current.toFixed(1) + unit
    : current.toLocaleString("pt-BR") + unit

  return <span style={{ color, fontSize: "24px", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{display}</span>
}

function LiveDot() {
  return (
    <span style={{ position: "relative", display: "inline-block", width: "8px", height: "8px" }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: "#34d399",
        animation: "ping 1.4s cubic-bezier(0,0,.2,1) infinite",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#34d399" }} />
    </span>
  )
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { user, perfil } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && perfil?.role === "admin") navigate("/admin")
  }, [user, perfil])

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    try {
      await login(email, senha)
    } catch {
      setErro("Email ou senha inválidos.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes ticker { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        .login-input { width:100%; background:#0d1117; border:1px solid #21262d; border-radius:10px; padding:13px 16px; color:#e6edf3; font-size:14px; outline:none; box-sizing:border-box; transition:border-color .2s; font-family:inherit; }
        .login-input:focus { border-color:#388bfd; }
        .login-input::placeholder { color:#484f58; }
        .login-btn { width:100%; padding:14px; background:#1f6feb; border:none; border-radius:10px; color:#fff; font-size:15px; font-weight:600; cursor:pointer; font-family:inherit; transition:background .2s,transform .1s; }
        .login-btn:hover:not(:disabled) { background:#388bfd; }
        .login-btn:active:not(:disabled) { transform:scale(.98); }
        .login-btn:disabled { opacity:.6; cursor:not-allowed; }
        .stat-card { animation: fadeUp .5s ease both; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#0d1117", fontFamily: "'Syne', system-ui, sans-serif" }}>

        {/* ── Painel esquerdo ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", borderRight: "1px solid #21262d", position: "relative", overflow: "hidden" }}>

          {/* Grid de fundo */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .04 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#58a6ff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px", animation: "fadeUp .4s ease" }}>
            <div style={{ width: "36px", height: "36px", background: "#1f6feb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.03em" }}>AdMetrics</span>
            <div style={{ marginLeft: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <LiveDot />
              <span style={{ fontSize: "11px", color: "#34d399", fontFamily: "'DM Mono', monospace" }}>ao vivo</span>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: "48px", animation: "fadeUp .4s .1s ease both" }}>
            <h1 style={{ margin: "0 0 10px", fontSize: "36px", fontWeight: 800, color: "#e6edf3", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Performance<br />em tempo real.
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#8b949e", lineHeight: 1.6 }}>
              Métricas, campanhas e clientes<br />em um só lugar.
            </p>
          </div>

          {/* Cards de métricas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-card" style={{ animationDelay: `${.2 + i * .08}s`, background: "#161b22", border: "1px solid #21262d", borderRadius: "12px", padding: "16px 18px" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", fontFamily: "'DM Mono', monospace", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <AnimatedNumber target={s.value} unit={s.unit} color={s.color} />
                  <Sparkline data={SPARKLINE_DATA} color={s.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé */}
          <div style={{ marginTop: "40px", fontSize: "12px", color: "#484f58", fontFamily: "'DM Mono', monospace", animation: "fadeUp .4s .6s ease both" }}>
            © {new Date().getFullYear()} AdMetrics · Todos os direitos reservados
          </div>
        </div>

        {/* ── Formulário direito ── */}
        <div style={{ width: "440px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px" }}>
          <div style={{ animation: "fadeUp .5s .15s ease both" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 700, color: "#e6edf3", letterSpacing: "-0.02em" }}>Entrar</h2>
            <p style={{ margin: "0 0 36px", fontSize: "14px", color: "#8b949e" }}>Acesse o painel de controle</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "8px", fontWeight: 600 }}>Email</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "8px", fontWeight: 600 }}>Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    className="login-input"
                    placeholder="••••••••"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                    style={{ paddingRight: "44px" }}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#484f58", padding: 0, display: "flex" }}>
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {erro && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", background: "#1a0a0a", border: "1px solid #f8514922", borderRadius: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize: "13px", color: "#f85149" }}>{erro}</span>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={carregando} style={{ marginTop: "4px" }}>
                {carregando ? "Entrando..." : "Entrar no painel"}
              </button>

            </form>

            <div style={{ marginTop: "32px", padding: "16px", background: "#161b22", border: "1px solid #21262d", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#484f58", fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                <span style={{ color: "#8b949e" }}>Acesso restrito</span> a administradores autorizados.
                Entre em contato para suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}