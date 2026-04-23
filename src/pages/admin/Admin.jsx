import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { logout } from "../../services/authService"
import { getClientes } from "../../services/clienteService"

// ─── Dados fictícios ──────────────────────────────────────────────────────────
const MOCK_IMPRESSOES = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  data: [820000, 940000, 1050000, 1200000, 1380000, 1510000],
}

const MOCK_CLIENTES_EXTRAS = [
  { id: "m1", nome: "Fernanda Costa",  email: "fernanda@nexus.com",   empresa: "Nexus Mídia",      campanhas: 8,  roi: "4.1x", status: "ativo"   },
  { id: "m2", nome: "Rafael Mendes",   email: "rafael@clickpro.com",  empresa: "ClickPro Agency",  campanhas: 5,  roi: "3.8x", status: "ativo"   },
  { id: "m3", nome: "Julia Alves",     email: "julia@startupbr.com",  empresa: "Startup BR",       campanhas: 2,  roi: "2.1x", status: "trial"   },
  { id: "m4", nome: "Marcos Lima",     email: "marcos@limaecom.com",  empresa: "Lima E-commerce",  campanhas: 12, roi: "5.2x", status: "ativo"   },
  { id: "m5", nome: "Ana Torres",      email: "ana@torresdigital.com",empresa: "Torres Digital",   campanhas: 0,  roi: "—",    status: "pausado" },
  { id: "m6", nome: "Carlos Souza",    email: "carlos@souza360.com",  empresa: "Souza 360",        campanhas: 3,  roi: "2.9x", status: "ativo"   },
  { id: "m7", nome: "Beatriz Nunes",   email: "bea@bnmedia.com",      empresa: "BN Media",         campanhas: 7,  roi: "3.3x", status: "trial"   },
]

// ─── Ícones ───────────────────────────────────────────────────────────────────
const Ico = {
  Grid:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Users:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Chart:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Plus:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Logout: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Sort:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
  Arrow:  ({ up }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>,
  Eye:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
}

const NAV = [
  { id: "dashboard", label: "Dashboard", I: Ico.Grid },
  { id: "clientes",  label: "Clientes",  I: Ico.Users },
  { id: "campanhas", label: "Campanhas", I: Ico.Chart },
]

const AVATAR_COLORS = ["#1d4ed8","#0d9488","#7c3aed","#b45309","#be185d","#0f766e","#9333ea"]
const avatarColor = n => AVATAR_COLORS[(n?.charCodeAt(0)||0) % AVATAR_COLORS.length]
const iniciais    = n => n?.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() || "?"

const STATUS_STYLE = {
  ativo:   { bg:"#0d2a1e", color:"#2dd4bf", label:"Ativo"   },
  trial:   { bg:"#1e1a3a", color:"#a78bfa", label:"Trial"   },
  pausado: { bg:"#2a1f0a", color:"#fbbf24", label:"Pausado" },
}

// ─── Gráficos ─────────────────────────────────────────────────────────────────
function LineChart() {
  const ref = useRef(null)
  const ch  = useRef(null)
  useEffect(() => {
    const init = () => {
      if (ch.current) ch.current.destroy()
      ch.current = new window.Chart(ref.current, {
        type: "line",
        data: { labels: MOCK_IMPRESSOES.labels, datasets: [{ data: MOCK_IMPRESSOES.data, borderColor:"#2563eb", backgroundColor:"rgba(37,99,235,.12)", borderWidth:2, pointBackgroundColor:"#2563eb", pointRadius:4, tension:.4, fill:true }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:"#475569",font:{size:11}},grid:{color:"#1e293b"}}, y:{ticks:{color:"#475569",font:{size:11},callback:v=>(v/1000)+"k"},grid:{color:"#1e293b"}} } },
      })
    }
    if (window.Chart) init()
    else { const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"; s.onload=init; document.body.appendChild(s) }
    return () => ch.current?.destroy()
  }, [])
  return <div style={{position:"relative",height:"160px"}}><canvas ref={ref}/></div>
}

function DoughnutChart({ ativos, trial, pausados }) {
  const ref = useRef(null)
  const ch  = useRef(null)
  useEffect(() => {
    const init = () => {
      if (ch.current) ch.current.destroy()
      ch.current = new window.Chart(ref.current, {
        type: "doughnut",
        data: { labels:["Ativos","Trial","Pausados"], datasets:[{ data:[ativos,trial,pausados], backgroundColor:["#2563eb","#7c3aed","#d97706"], borderWidth:0, hoverOffset:4 }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:"68%", plugins:{legend:{display:false}} },
      })
    }
    if (window.Chart) init()
    else { const t=setInterval(()=>{if(window.Chart){init();clearInterval(t)}},100) }
    return () => ch.current?.destroy()
  }, [ativos, trial, pausados])
  return <div style={{position:"relative",height:"120px"}}><canvas ref={ref}/></div>
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, accent }) {
  const A = { blue:{bg:"#1a2744",border:"#2563eb",color:"#60a5fa"}, teal:{bg:"#0f2a24",border:"#0d9488",color:"#2dd4bf"}, purple:{bg:"#1e1a3a",border:"#7c3aed",color:"#a78bfa"}, amber:{bg:"#2a1f0a",border:"#d97706",color:"#fbbf24"} }
  const c = A[accent] || A.blue
  return (
    <div style={{background:c.bg,border:`1px solid ${c.border}22`,borderLeft:`3px solid ${c.border}`,borderRadius:"12px",padding:"18px 20px"}}>
      <div style={{fontSize:"10px",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"#64748b",marginBottom:"6px"}}>{label}</div>
      <div style={{fontSize:"28px",fontWeight:700,color:"#f1f5f9",lineHeight:1.1}}>{value}</div>
      {sub && <div style={{fontSize:"11px",color:c.color,marginTop:"4px"}}>{sub}</div>}
    </div>
  )
}

// ─── Modal novo cliente ───────────────────────────────────────────────────────
function NovoClienteModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ nome:"", empresa:"", email:"", senha:"" })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const inp = { width:"100%", background:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px", padding:"10px 14px", color:"#f1f5f9", fontSize:"14px", outline:"none", boxSizing:"border-box" }

  async function handleSubmit(e) {
    e.preventDefault(); setErro(""); setLoading(true)
    try { const { criarCliente } = await import("../../services/authService"); await criarCliente(form); onSuccess(); onClose() }
    catch (err) { setErro("Erro ao criar cliente. Verifique os dados."); console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:"16px",padding:"32px",width:"100%",maxWidth:"420px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
          <h2 style={{margin:0,fontSize:"18px",fontWeight:600,color:"#f1f5f9"}}>Novo Cliente</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"22px",lineHeight:1}}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {[{key:"nome",label:"Nome",type:"text",ph:"Nome completo"},{key:"empresa",label:"Empresa",type:"text",ph:"Nome da empresa"},{key:"email",label:"Email",type:"email",ph:"email@empresa.com"},{key:"senha",label:"Senha",type:"password",ph:"Senha de acesso"}].map(({key,label,type,ph})=>(
            <div key={key}>
              <label style={{display:"block",fontSize:"12px",color:"#64748b",marginBottom:"6px",fontWeight:500}}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={inp} required />
            </div>
          ))}
          {erro && <p style={{color:"#f87171",fontSize:"13px",margin:0}}>{erro}</p>}
          <div style={{display:"flex",gap:"10px",marginTop:"8px"}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:"10px",background:"transparent",border:"1px solid #1e293b",borderRadius:"8px",color:"#94a3b8",cursor:"pointer",fontSize:"14px"}}>Cancelar</button>
            <button type="submit" disabled={loading} style={{flex:1,padding:"10px",background:"#2563eb",border:"none",borderRadius:"8px",color:"#fff",cursor:"pointer",fontSize:"14px",fontWeight:500,opacity:loading?.7:1}}>{loading?"Criando...":"Criar Cliente"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function PaginaDashboard({ todosClientes }) {
  const ativos   = todosClientes.filter(c=>!c.status||c.status==="ativo").length
  const trial    = todosClientes.filter(c=>c.status==="trial").length
  const pausados = todosClientes.filter(c=>c.status==="pausado").length
  return (
    <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"14px",marginBottom:"24px"}}>
        <MetricCard label="Total clientes"    value={todosClientes.length} sub="+3 este mês"        accent="blue"   />
        <MetricCard label="Campanhas ativas"  value="61"                   sub="+8 esta semana"     accent="teal"   />
        <MetricCard label="Impressões"        value="1.5M"                 sub="+18% vs mês ant."   accent="purple" />
        <MetricCard label="ROI médio"         value="3.4x"                 sub="+0.2x vs mês ant."  accent="amber"  />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"20px"}}>
          <div style={{fontSize:"11px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",marginBottom:"14px"}}>Impressões mensais</div>
          <LineChart />
        </div>
        <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"20px"}}>
          <div style={{fontSize:"11px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",marginBottom:"10px"}}>Clientes por status</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px",marginBottom:"12px"}}>
            {[["#2563eb",`Ativos ${ativos}`],["#7c3aed",`Trial ${trial}`],["#d97706",`Pausados ${pausados}`]].map(([bg,label])=>(
              <span key={label} style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"11px",color:"#64748b"}}>
                <span style={{width:"8px",height:"8px",borderRadius:"2px",background:bg,display:"inline-block"}}/>{label}
              </span>
            ))}
          </div>
          <DoughnutChart ativos={ativos} trial={trial} pausados={pausados}/>
        </div>
      </div>
      <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #1e293b"}}>
          <span style={{fontSize:"11px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em"}}>Clientes recentes</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #1e293b"}}>{["Cliente","Empresa","Campanhas","ROI","Status"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:"10px",fontWeight:600,color:"#334155",textTransform:"uppercase",letterSpacing:".07em"}}>{h}</th>)}</tr></thead>
          <tbody>
            {todosClientes.slice(0,5).map((c,i)=>{
              const st=STATUS_STYLE[c.status||"ativo"]
              return (
                <tr key={c.id} style={{borderBottom:i<4?"1px solid #0f172a":"none"}}>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"30px",height:"30px",borderRadius:"50%",background:avatarColor(c.nome),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#fff",flexShrink:0}}>{iniciais(c.nome)}</div>
                      <span style={{fontSize:"13px",fontWeight:500,color:"#e2e8f0"}}>{c.nome}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:"12px",color:"#64748b"}}>{c.empresa||"—"}</td>
                  <td style={{padding:"12px 16px",fontSize:"12px",color:"#64748b"}}>{c.campanhas??("—")}</td>
                  <td style={{padding:"12px 16px",fontSize:"12px",color:c.roi&&c.roi!=="—"?"#2dd4bf":"#64748b"}}>{c.roi||"—"}</td>
                  <td style={{padding:"12px 16px"}}><span style={{display:"inline-block",padding:"3px 10px",background:st.bg,color:st.color,borderRadius:"20px",fontSize:"10px",fontWeight:600}}>{st.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ─── Clientes com filtros e ordenação ────────────────────────────────────────
function PaginaClientes({ todosClientes, onVerDetalhe }) {
  const [busca,    setBusca]    = useState("")
  const [filtroSt, setFiltroSt] = useState("todos")
  const [ordenar,  setOrdenar]  = useState({ campo: "nome", asc: true })

  const COLS = [
    { key:"nome",      label:"Cliente"   },
    { key:"empresa",   label:"Empresa"   },
    { key:"email",     label:"Email"     },
    { key:"campanhas", label:"Campanhas" },
    { key:"roi",       label:"ROI"       },
    { key:"status",    label:"Status"    },
  ]

  function toggleOrdem(campo) {
    setOrdenar(o => o.campo === campo ? { campo, asc: !o.asc } : { campo, asc: true })
  }

  const filtrados = todosClientes
    .filter(c => filtroSt === "todos" || (c.status || "ativo") === filtroSt)
    .filter(c =>
      c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      c.email?.toLowerCase().includes(busca.toLowerCase()) ||
      c.empresa?.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      const campo = ordenar.campo
      let va = a[campo] ?? ""
      let vb = b[campo] ?? ""
      if (campo === "campanhas") { va = Number(va) || 0; vb = Number(vb) || 0 }
      else if (campo === "roi")  { va = parseFloat(va) || 0; vb = parseFloat(vb) || 0 }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase() }
      if (va < vb) return ordenar.asc ? -1 :  1
      if (va > vb) return ordenar.asc ?  1 : -1
      return 0
    })

  const contagens = {
    todos:   todosClientes.length,
    ativo:   todosClientes.filter(c=>(!c.status||c.status==="ativo")).length,
    trial:   todosClientes.filter(c=>c.status==="trial").length,
    pausado: todosClientes.filter(c=>c.status==="pausado").length,
  }

  const thStyle = (key) => ({
    padding:"10px 16px", textAlign:"left", fontSize:"10px", fontWeight:600,
    color: ordenar.campo === key ? "#93c5fd" : "#334155",
    textTransform:"uppercase", letterSpacing:".07em", cursor:"pointer",
    userSelect:"none", whiteSpace:"nowrap",
  })

  return (
    <>
      {/* Filtros de status */}
      <div style={{display:"flex",gap:"6px",marginBottom:"16px",flexWrap:"wrap"}}>
        {[["todos","Todos"],["ativo","Ativos"],["trial","Trial"],["pausado","Pausados"]].map(([val,label])=>(
          <button key={val} onClick={()=>setFiltroSt(val)} style={{
            padding:"6px 14px", borderRadius:"20px", border:"1px solid",
            fontSize:"12px", fontWeight:500, cursor:"pointer",
            background: filtroSt===val?"#1e293b":"transparent",
            borderColor: filtroSt===val?"#334155":"#1e293b",
            color: filtroSt===val?"#f1f5f9":"#64748b",
          }}>
            {label} <span style={{opacity:.6}}>({contagens[val]})</span>
          </button>
        ))}
      </div>

      <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",overflow:"hidden"}}>
        {/* Busca */}
        <div style={{padding:"14px 20px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{color:"#475569"}}><Ico.Search/></div>
          <input type="text" placeholder="Buscar por nome, email ou empresa..."
            value={busca} onChange={e=>setBusca(e.target.value)}
            style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#f1f5f9",fontSize:"14px"}}/>
          {busca && <button onClick={()=>setBusca("")} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"18px"}}>×</button>}
          <span style={{fontSize:"11px",color:"#334155",marginLeft:"auto",whiteSpace:"nowrap"}}>{filtrados.length} resultado{filtrados.length!==1?"s":""}</span>
        </div>

        {/* Tabela */}
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:"1px solid #1e293b"}}>
              {COLS.map(({key,label})=>(
                <th key={key} style={thStyle(key)} onClick={()=>toggleOrdem(key)}>
                  <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                    {label}
                    {ordenar.campo===key
                      ? <Ico.Arrow up={ordenar.asc}/>
                      : <span style={{opacity:.2}}><Ico.Sort/></span>
                    }
                  </div>
                </th>
              ))}
              <th style={{padding:"10px 16px",fontSize:"10px",color:"#334155",textTransform:"uppercase",letterSpacing:".07em"}}></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0 ? (
              <tr><td colSpan={7} style={{padding:"48px",textAlign:"center",color:"#334155",fontSize:"14px"}}>
                {busca?"Nenhum cliente encontrado.":"Nenhum cliente nesta categoria."}
              </td></tr>
            ) : filtrados.map((c,i)=>{
              const st=STATUS_STYLE[c.status||"ativo"]
              return (
                <tr key={c.id}
                  style={{borderBottom:i<filtrados.length-1?"1px solid #0f172a":"none"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#0f172a"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"13px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"34px",height:"34px",borderRadius:"50%",background:avatarColor(c.nome),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#fff",flexShrink:0}}>{iniciais(c.nome)}</div>
                      <span style={{fontSize:"13px",fontWeight:500,color:"#e2e8f0"}}>{c.nome||"—"}</span>
                    </div>
                  </td>
                  <td style={{padding:"13px 16px",fontSize:"12px",color:"#64748b"}}>{c.empresa||"—"}</td>
                  <td style={{padding:"13px 16px",fontSize:"12px",color:"#64748b"}}>{c.email||"—"}</td>
                  <td style={{padding:"13px 16px",fontSize:"12px",color:"#64748b"}}>{c.campanhas??("—")}</td>
                  <td style={{padding:"13px 16px",fontSize:"12px",color:c.roi&&c.roi!=="—"?"#2dd4bf":"#64748b"}}>{c.roi||"—"}</td>
                  <td style={{padding:"13px 16px"}}><span style={{display:"inline-block",padding:"3px 10px",background:st.bg,color:st.color,borderRadius:"20px",fontSize:"10px",fontWeight:600}}>{st.label}</span></td>
                  <td style={{padding:"13px 16px"}}>
                    <button onClick={()=>onVerDetalhe(c)} style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 10px",background:"#1e293b",border:"none",borderRadius:"6px",color:"#94a3b8",cursor:"pointer",fontSize:"12px"}}>
                      <Ico.Eye/> Ver
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ─── Campanhas placeholder ────────────────────────────────────────────────────
function PaginaCampanhas() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"300px",gap:"12px"}}>
      <div style={{color:"#334155"}}><Ico.Chart/></div>
      <p style={{fontSize:"14px",color:"#334155",margin:0}}>Módulo de campanhas em breve</p>
    </div>
  )
}

// ─── Detalhe do cliente inline ────────────────────────────────────────────────
const MOCK_CAMPANHAS_DETALHE = [
  { id:"c1",nome:"Google Ads — Verão 2026",status:"ativo",  impressoes:142000,cliques:8400,conversoes:312,roi:"4.2x",budget:3200,gasto:2850,inicio:"01/03/2026"},
  { id:"c2",nome:"Meta Ads — Remarketing", status:"ativo",  impressoes:98500, cliques:5100,conversoes:198,roi:"3.8x",budget:2000,gasto:1760,inicio:"15/03/2026"},
  { id:"c3",nome:"Google Ads — Marca",     status:"pausado",impressoes:45200, cliques:2800,conversoes:94, roi:"2.1x",budget:1500,gasto:1500,inicio:"10/01/2026"},
  { id:"c4",nome:"TikTok Ads — Awareness", status:"trial",  impressoes:210000,cliques:4200,conversoes:87, roi:"1.9x",budget:4000,gasto:1200,inicio:"01/04/2026"},
]

const MOCK_ATIVIDADES = [
  { data:"18/04/2026",evento:"Campanha 'Google Ads — Verão 2026' atingiu meta de conversões" },
  { data:"15/04/2026",evento:"Budget de 'Meta Ads — Remarketing' aumentado para R$ 2.000"   },
  { data:"10/04/2026",evento:"Nova campanha 'TikTok Ads — Awareness' iniciada"               },
  { data:"01/04/2026",evento:"Relatório mensal de março gerado e enviado"                    },
]

function ClienteDetalheInline({ cliente, onVoltar }) {
  const [aba, setAba] = useState("campanhas")
  const totalImpressoes = MOCK_CAMPANHAS_DETALHE.reduce((s,c)=>s+c.impressoes,0)
  const totalCliques    = MOCK_CAMPANHAS_DETALHE.reduce((s,c)=>s+c.cliques,0)
  const totalConversoes = MOCK_CAMPANHAS_DETALHE.reduce((s,c)=>s+c.conversoes,0)
  const totalGasto      = MOCK_CAMPANHAS_DETALHE.reduce((s,c)=>s+c.gasto,0)

  return (
    <>
      {/* Breadcrumb */}
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"24px"}}>
        <button onClick={onVoltar} style={{display:"flex",alignItems:"center",gap:"5px",background:"#1e293b",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"12px",padding:"6px 12px",borderRadius:"6px"}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <span style={{color:"#334155",fontSize:"12px"}}>/</span>
        <span style={{fontSize:"12px",color:"#64748b"}}>Clientes</span>
        <span style={{color:"#334155",fontSize:"12px"}}>/</span>
        <span style={{fontSize:"12px",color:"#e2e8f0"}}>{cliente.nome}</span>
      </div>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <div style={{width:"56px",height:"56px",borderRadius:"50%",background:avatarColor(cliente.nome),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:700,color:"#fff",flexShrink:0}}>
            {iniciais(cliente.nome)}
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
              <h2 style={{margin:0,fontSize:"20px",fontWeight:700,color:"#f1f5f9"}}>{cliente.nome}</h2>
              {(()=>{const st=STATUS_STYLE[cliente.status||"ativo"];return <span style={{padding:"3px 12px",background:st.bg,color:st.color,borderRadius:"20px",fontSize:"11px",fontWeight:600}}>{st.label}</span>})()}
            </div>
            <div style={{display:"flex",gap:"16px"}}>
              <span style={{fontSize:"13px",color:"#64748b"}}>{cliente.empresa}</span>
              <span style={{fontSize:"13px",color:"#64748b"}}>{cliente.email}</span>
            </div>
          </div>
        </div>
        <button style={{display:"flex",alignItems:"center",gap:"7px",padding:"9px 16px",background:"#2563eb",border:"none",borderRadius:"8px",color:"#fff",cursor:"pointer",fontSize:"13px",fontWeight:500}}>
          <Ico.Plus/> Nova Campanha
        </button>
      </div>

      {/* Métricas */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"12px",marginBottom:"28px"}}>
        {[
          {label:"Impressões totais",value:totalImpressoes.toLocaleString("pt-BR"),color:"#60a5fa"},
          {label:"Cliques totais",   value:totalCliques.toLocaleString("pt-BR"),   color:"#34d399"},
          {label:"Conversões",       value:totalConversoes,                         color:"#a78bfa"},
          {label:"Gasto total",      value:`R$ ${totalGasto.toLocaleString("pt-BR")}`,color:"#fbbf24"},
          {label:"ROI médio",        value:cliente.roi||"3.8x",                    color:"#fb923c"},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"10px",padding:"14px 16px"}}>
            <div style={{fontSize:"10px",fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:".07em",marginBottom:"6px"}}>{label}</div>
            <div style={{fontSize:"20px",fontWeight:700,color}}>{value}</div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{display:"flex",gap:"4px",borderBottom:"1px solid #1e293b",marginBottom:"20px"}}>
        {[["campanhas",`Campanhas (${MOCK_CAMPANHAS_DETALHE.length})`],["atividades","Atividades"]].map(([id,label])=>(
          <button key={id} onClick={()=>setAba(id)} style={{padding:"9px 16px",background:"none",border:"none",cursor:"pointer",fontSize:"13px",fontWeight:aba===id?600:400,color:aba===id?"#f1f5f9":"#64748b",borderBottom:aba===id?"2px solid #2563eb":"2px solid transparent",marginBottom:"-1px"}}>
            {label}
          </button>
        ))}
      </div>

      {/* Campanhas */}
      {aba==="campanhas" && (
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {MOCK_CAMPANHAS_DETALHE.map(camp=>{
            const st=STATUS_STYLE[camp.status]
            const pct=Math.min(100,Math.round((camp.gasto/camp.budget)*100))
            const barColor=camp.status==="ativo"?"#2563eb":camp.status==="trial"?"#7c3aed":"#d97706"
            return (
              <div key={camp.id} style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",padding:"20px 24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
                      <span style={{fontSize:"14px",fontWeight:600,color:"#e2e8f0"}}>{camp.nome}</span>
                      <span style={{padding:"2px 10px",background:st.bg,color:st.color,borderRadius:"20px",fontSize:"10px",fontWeight:600}}>{st.label}</span>
                    </div>
                    <span style={{fontSize:"12px",color:"#475569"}}>Iniciada em {camp.inicio}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"20px",fontWeight:700,color:"#2dd4bf"}}>{camp.roi}</div>
                    <div style={{fontSize:"11px",color:"#475569"}}>ROI</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"16px"}}>
                  {[["Impressões",camp.impressoes.toLocaleString("pt-BR")],["Cliques",camp.cliques.toLocaleString("pt-BR")],["Conversões",camp.conversoes]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{fontSize:"10px",color:"#475569",textTransform:"uppercase",letterSpacing:".07em",marginBottom:"3px"}}>{l}</div>
                      <div style={{fontSize:"15px",fontWeight:600,color:"#cbd5e1"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                    <span style={{fontSize:"11px",color:"#64748b"}}>R$ {camp.gasto.toLocaleString("pt-BR")} / R$ {camp.budget.toLocaleString("pt-BR")}</span>
                    <span style={{fontSize:"11px",color:"#64748b"}}>{pct}%</span>
                  </div>
                  <div style={{height:"5px",background:"#1e293b",borderRadius:"99px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:"99px"}}/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Atividades */}
      {aba==="atividades" && (
        <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:"14px",overflow:"hidden"}}>
          {MOCK_ATIVIDADES.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:"14px",padding:"16px 20px",borderBottom:i<MOCK_ATIVIDADES.length-1?"1px solid #0f172a":"none",alignItems:"flex-start"}}>
              <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#2563eb",marginTop:"5px",flexShrink:0}}/>
              <div>
                <p style={{margin:"0 0 3px",fontSize:"13px",color:"#cbd5e1"}}>{a.evento}</p>
                <span style={{fontSize:"11px",color:"#475569"}}>{a.data}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Admin() {
  const { user, perfil } = useAuth()
  const navigate = useNavigate()

  const [clientes,      setClientes]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [pagina,        setPagina]        = useState("dashboard")
  const [modalAberto,   setModalAberto]   = useState(false)
  const [clienteAtivo,  setClienteAtivo]  = useState(null)

  const todosClientes = [...clientes, ...MOCK_CLIENTES_EXTRAS]

  useEffect(() => {
    if (!user) { navigate("/"); return }
    getClientes().then(setClientes).catch(console.error).finally(()=>setLoading(false))
  }, [user])

  async function handleLogout() { await logout(); navigate("/") }

  function verDetalhe(c) { setClienteAtivo(c); setPagina("detalhe") }
  function voltarLista() { setClienteAtivo(null); setPagina("clientes") }

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#020617",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:"#475569",fontSize:"14px"}}>Carregando...</span>
    </div>
  )

  const titulos    = { dashboard:"Dashboard", clientes:"Clientes", campanhas:"Campanhas", detalhe:clienteAtivo?.nome||"Cliente" }
  const subtitulos = { dashboard:"Visão geral · Abril 2026", clientes:`${todosClientes.length} clientes cadastrados`, campanhas:"Gerencie suas campanhas", detalhe:clienteAtivo?.empresa||"" }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#020617",fontFamily:"'Inter', system-ui, sans-serif"}}>

      {/* Sidebar */}
      <aside style={{width:"220px",flexShrink:0,background:"#0a0f1e",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"24px 20px 18px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"30px",height:"30px",background:"#2563eb",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span style={{fontSize:"15px",fontWeight:700,color:"#f1f5f9",letterSpacing:"-0.02em"}}>AdMetrics</span>
        </div>
        <nav style={{padding:"14px 10px",flex:1}}>
          <p style={{fontSize:"10px",fontWeight:600,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",padding:"0 10px",margin:"0 0 8px"}}>Menu</p>
          {NAV.map(({id,label,I})=>(
            <button key={id} onClick={()=>{setPagina(id);setClienteAtivo(null)}} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px",borderRadius:"8px",border:"none",background:(pagina===id||( id==="clientes"&&pagina==="detalhe"))?"#1e293b":"transparent",color:(pagina===id||(id==="clientes"&&pagina==="detalhe"))?"#f1f5f9":"#64748b",cursor:"pointer",fontSize:"13px",fontWeight:(pagina===id||(id==="clientes"&&pagina==="detalhe"))?500:400,textAlign:"left",marginBottom:"2px"}}>
              <I/>{label}
              {(pagina===id||(id==="clientes"&&pagina==="detalhe"))&&<div style={{marginLeft:"auto",width:"5px",height:"5px",borderRadius:"50%",background:"#2563eb"}}/>}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 10px",borderTop:"1px solid #1e293b"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",marginBottom:"6px"}}>
            <div style={{width:"30px",height:"30px",borderRadius:"50%",background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#fff",flexShrink:0}}>{iniciais(perfil?.nome||user?.email)}</div>
            <div style={{overflow:"hidden"}}>
              <p style={{margin:0,fontSize:"12px",fontWeight:500,color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{perfil?.nome||"Admin"}</p>
              <p style={{margin:0,fontSize:"10px",color:"#475569"}}>Administrador</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px",borderRadius:"8px",border:"none",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"13px"}}>
            <Ico.Logout/> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1,overflowY:"auto"}}>
        {pagina!=="detalhe" && (
          <div style={{padding:"20px 28px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h1 style={{margin:0,fontSize:"18px",fontWeight:700,color:"#f1f5f9"}}>{titulos[pagina]}</h1>
              <p style={{margin:"2px 0 0",fontSize:"12px",color:"#475569"}}>{subtitulos[pagina]}</p>
            </div>
            {pagina==="clientes" && (
              <button onClick={()=>setModalAberto(true)} style={{display:"flex",alignItems:"center",gap:"7px",padding:"9px 16px",background:"#2563eb",border:"none",borderRadius:"8px",color:"#fff",cursor:"pointer",fontSize:"13px",fontWeight:500}}>
                <Ico.Plus/> Novo Cliente
              </button>
            )}
          </div>
        )}

        <div style={{padding:"24px 28px"}}>
          {pagina==="dashboard" && <PaginaDashboard todosClientes={todosClientes}/>}
          {pagina==="clientes"  && <PaginaClientes todosClientes={todosClientes} onVerDetalhe={verDetalhe}/>}
          {pagina==="campanhas" && <PaginaCampanhas/>}
          {pagina==="detalhe"   && clienteAtivo && <ClienteDetalheInline cliente={clienteAtivo} onVoltar={voltarLista}/>}
        </div>
      </main>

      {modalAberto && <NovoClienteModal onClose={()=>setModalAberto(false)} onSuccess={()=>getClientes().then(setClientes)}/>}
    </div>
  )
}