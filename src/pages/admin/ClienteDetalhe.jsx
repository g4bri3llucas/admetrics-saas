import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

// Dados fictícios para demonstração
const MOCK_CAMPANHAS = [
  { id: "c1", nome: "Google Ads — Verão 2026", status: "ativo", impressoes: 142000, cliques: 8400, conversoes: 312, roi: "4.2x", budget: 3200, gasto: 2850, inicio: "01/03/2026" },
  { id: "c2", nome: "Meta Ads — Remarketing", status: "ativo", impressoes: 98500, cliques: 5100, conversoes: 198, roi: "3.8x", budget: 2000, gasto: 1760, inicio: "15/03/2026" },
  { id: "c3", nome: "Google Ads — Marca", status: "pausado", impressoes: 45200, cliques: 2800, conversoes: 94, roi: "2.1x", budget: 1500, gasto: 1500, inicio: "10/01/2026" },
  { id: "c4", nome: "TikTok Ads — Awareness", status: "trial", impressoes: 210000, cliques: 4200, conversoes: 87, roi: "1.9x", budget: 4000, gasto: 1200, inicio: "01/04/2026" },
]

const MOCK_ATIVIDADES = [
  { data: "18/04/2026", evento: "Campanha 'Google Ads — Verão 2026' atingiu meta de conversões" },
  { data: "15/04/2026", evento: "Budget de 'Meta Ads — Remarketing' aumentado para R$ 2.000" },
  { data: "10/04/2026", evento: "Nova campanha 'TikTok Ads — Awareness' iniciada" },
  { data: "01/04/2026", evento: "Relatório mensal de março gerado e enviado" },
  { data: "20/03/2026", evento: "ROI de 'Google Ads — Verão 2026' subiu para 4.2x" },
]

const STATUS_STYLE = {
  ativo:   { bg: "#0d2a1e", color: "#2dd4bf", label: "Ativo" },
  trial:   { bg: "#1e1a3a", color: "#a78bfa", label: "Trial" },
  pausado: { bg: "#2a1f0a", color: "#fbbf24", label: "Pausado" },
}

const AVATAR_COLORS = ["#1d4ed8", "#0d9488", "#7c3aed", "#b45309", "#be185d", "#0f766e", "#9333ea"]
const avatarColor = (nome) => AVATAR_COLORS[(nome?.charCodeAt(0) || 0) % AVATAR_COLORS.length]
const iniciais = (nome) => nome?.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "?"

function MetricMini({ label, value, color }) {
  return (
    <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "10px", padding: "14px 16px" }}>
      <div style={{ fontSize: "10px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: 700, color: color || "#f1f5f9" }}>{value}</div>
    </div>
  )
}

function ProgressBar({ gasto, budget, color = "#2563eb" }) {
  const pct = Math.min(100, Math.round((gasto / budget) * 100))
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", color: "#64748b" }}>R$ {gasto.toLocaleString("pt-BR")} / R$ {budget.toLocaleString("pt-BR")}</span>
        <span style={{ fontSize: "11px", color: "#64748b" }}>{pct}%</span>
      </div>
      <div style={{ height: "5px", background: "#1e293b", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width .6s ease" }} />
      </div>
    </div>
  )
}

export default function ClienteDetalhe({ clienteData }) {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState("campanhas")

  // Usa dados passados por prop ou dados fictícios de demo
  const cliente = clienteData || {
    id: "demo",
    nome: "Fernanda Costa",
    email: "fernanda@nexus.com",
    empresa: "Nexus Mídia",
    status: "ativo",
    roi: "4.1x",
    campanhas: MOCK_CAMPANHAS.length,
    createdAt: "09/04/2026",
  }

  const totalImpressoes = MOCK_CAMPANHAS.reduce((s, c) => s + c.impressoes, 0)
  const totalCliques    = MOCK_CAMPANHAS.reduce((s, c) => s + c.cliques, 0)
  const totalConversoes = MOCK_CAMPANHAS.reduce((s, c) => s + c.conversoes, 0)
  const totalGasto      = MOCK_CAMPANHAS.reduce((s, c) => s + c.gasto, 0)

  const abas = ["campanhas", "atividades"]

  return (
    <div style={{ minHeight: "100vh", background: "#020617", fontFamily: "'Inter', system-ui, sans-serif", color: "#f1f5f9" }}>

      {/* Topbar */}
      <div style={{ padding: "18px 32px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "14px" }}>
        <button onClick={() => navigate("/admin")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", padding: "6px 10px", borderRadius: "6px" }}
          onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <span style={{ color: "#1e293b" }}>/</span>
        <span style={{ fontSize: "13px", color: "#64748b" }}>Clientes</span>
        <span style={{ color: "#1e293b" }}>/</span>
        <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{cliente.nome}</span>
      </div>

      <div style={{ padding: "32px" }}>

        {/* Header do cliente */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: avatarColor(cliente.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {iniciais(cliente.nome)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#f1f5f9" }}>{cliente.nome}</h1>
                {(() => { const st = STATUS_STYLE[cliente.status || "ativo"]; return (
                  <span style={{ padding: "3px 12px", background: st.bg, color: st.color, borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{st.label}</span>
                )})()}
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>{cliente.empresa}</span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>{cliente.email}</span>
                {cliente.createdAt && <span style={{ fontSize: "13px", color: "#64748b" }}>Cliente desde {cliente.createdAt}</span>}
              </div>
            </div>
          </div>

          <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nova Campanha
          </button>
        </div>

        {/* Métricas resumo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          <MetricMini label="Impressões totais" value={totalImpressoes.toLocaleString("pt-BR")} color="#60a5fa" />
          <MetricMini label="Cliques totais" value={totalCliques.toLocaleString("pt-BR")} color="#34d399" />
          <MetricMini label="Conversões" value={totalConversoes.toLocaleString("pt-BR")} color="#a78bfa" />
          <MetricMini label="Gasto total" value={`R$ ${totalGasto.toLocaleString("pt-BR")}`} color="#fbbf24" />
          <MetricMini label="ROI médio" value={cliente.roi || "3.8x"} color="#fb923c" />
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "0" }}>
          {abas.map(aba => (
            <button key={aba} onClick={() => setAbaAtiva(aba)} style={{
              padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: abaAtiva === aba ? 600 : 400,
              color: abaAtiva === aba ? "#f1f5f9" : "#64748b",
              borderBottom: abaAtiva === aba ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: "-1px", textTransform: "capitalize",
            }}>
              {aba === "campanhas" ? `Campanhas (${MOCK_CAMPANHAS.length})` : "Atividades"}
            </button>
          ))}
        </div>

        {/* Aba Campanhas */}
        {abaAtiva === "campanhas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {MOCK_CAMPANHAS.map(camp => {
              const st = STATUS_STYLE[camp.status]
              return (
                <div key={camp.id} style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>{camp.nome}</span>
                        <span style={{ padding: "2px 10px", background: st.bg, color: st.color, borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>{st.label}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: "#475569" }}>Iniciada em {camp.inicio}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: "#2dd4bf" }}>{camp.roi}</div>
                      <div style={{ fontSize: "11px", color: "#475569" }}>ROI</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
                    {[
                      { label: "Impressões", value: camp.impressoes.toLocaleString("pt-BR") },
                      { label: "Cliques", value: camp.cliques.toLocaleString("pt-BR") },
                      { label: "Conversões", value: camp.conversoes },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: "10px", color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>{label}</div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#cbd5e1" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <ProgressBar gasto={camp.gasto} budget={camp.budget} color={camp.status === "ativo" ? "#2563eb" : camp.status === "trial" ? "#7c3aed" : "#d97706"} />
                </div>
              )
            })}
          </div>
        )}

        {/* Aba Atividades */}
        {abaAtiva === "atividades" && (
          <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
            {MOCK_ATIVIDADES.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", padding: "16px 20px", borderBottom: i < MOCK_ATIVIDADES.length - 1 ? "1px solid #0f172a" : "none", alignItems: "flex-start" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2563eb", marginTop: "5px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: "13px", color: "#cbd5e1" }}>{a.evento}</p>
                  <span style={{ fontSize: "11px", color: "#475569" }}>{a.data}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}