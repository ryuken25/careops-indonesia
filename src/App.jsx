import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, BarChart3, Bell,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck,
  ClipboardList, Clock3, Database, Droplets, FileText, HeartPulse, LayoutDashboard, LayoutGrid,
  ListChecks, MapPin, Menu, MessageCircle, MoreHorizontal, NotebookPen, Pencil, Phone, Plus,
  RotateCcw, Search, ShieldCheck, Smile, Sparkles, Stethoscope, Trash2, TrendingUp, UserRound, UsersRound,
  Utensils, X,
} from 'lucide-react'
import { LoadBar, StatusDonut, TrendChart, VitalsChart, VitalsPulse } from './charts.jsx'
import {
  INITIAL_FAMILY_UPDATE, STORAGE_KEY, caregiverLoad, caregivers as caregiverSeed,
  clients as clientSeed, incidents as incidentSeed, initialVisits, statusDistribution, weeklyTrend,
} from './data.js'
import './styles.css'

const MOODS = [
  { key: 'baik', label: 'Baik', emoji: '😊' },
  { key: 'cukup', label: 'Cukup', emoji: '🙂' },
  { key: 'lesu', label: 'Lesu', emoji: '😔' },
]
const STORAGE_CLIENTS = 'careops-clients-v2'
const STORAGE_CAREGIVERS = 'careops-caregivers'
const STORAGE_INCIDENTS = 'careops-incidents'
const uid = () => 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
const initialsOf = (name) => (name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
const load = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v } catch { return fallback } }
const defaultVitals = () => Array.from({ length: 7 }, (_, i) => ({ date: `${12 + i}/08`, sistolik: 124 + i, diastolik: 80, nadi: 72 }))
const STATUS_TONE = { 'Bertugas': 'green', 'Sedang kunjungan': 'blue', 'Siap ditugaskan': 'slate', 'Istirahat': 'amber' }

function App() {
  const [clients, setClients] = useState(() => load(STORAGE_CLIENTS, clientSeed))
  const [caregivers, setCaregivers] = useState(() => load(STORAGE_CAREGIVERS, caregiverSeed))
  const [visits, setVisits] = useState(() => load(STORAGE_KEY, initialVisits))
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [caregiverForm, setCaregiverForm] = useState(null)
  const [clientForm, setClientForm] = useState(null)
  const [visitForm, setVisitForm] = useState(null)
  const [incidentForm, setIncidentForm] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [incidents, setIncidents] = useState(() => load(STORAGE_INCIDENTS, incidentSeed))
  const [noticeVisible, setNoticeVisible] = useState(true)
  const [toast, setToast] = useState('')
  const [familyUpdate, setFamilyUpdate] = useState(INITIAL_FAMILY_UPDATE)
  const location = useLocation()
  const isCoordinator = location.pathname.startsWith('/koordinator')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(visits)) }, [visits])
  useEffect(() => { localStorage.setItem(STORAGE_CLIENTS, JSON.stringify(clients)) }, [clients])
  useEffect(() => { localStorage.setItem(STORAGE_CAREGIVERS, JSON.stringify(caregivers)) }, [caregivers])
  useEffect(() => { localStorage.setItem(STORAGE_INCIDENTS, JSON.stringify(incidents)) }, [incidents])

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const updateVisit = (id, patch) => setVisits((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  const setStatus = (visit, status) => {
    updateVisit(visit.id, { status })
    if (status === 'completed') notify(`Kunjungan ${visit.client} ditandai selesai.`)
    if (status === 'checked-in') notify(`Kunjungan ${visit.client} dimulai.`)
  }

  const toggleChecklist = (visitId, index) => setVisits((items) => items.map((item) => {
    if (item.id !== visitId) return item
    const checklist = item.checklist.map((c, i) => (i === index ? { ...c, done: !c.done } : c))
    return { ...item, checklist }
  }))

  const upsert = (setter) => (data) => setter((list) => list.some((x) => x.id === data.id) ? list.map((x) => (x.id === data.id ? data : x)) : [...list, data])

  const saveCaregiver = (data) => { upsert(setCaregivers)(data); setCaregiverForm(null); notify(`${data.name} disimpan.`) }
  const saveClient = (data) => { upsert(setClients)(data); setClientForm(null); notify(`${data.name} disimpan.`) }
  const saveVisit = (data) => { upsert(setVisits)(data); setVisitForm(null); notify('Kunjungan disimpan.') }
  const saveIncident = (data) => { upsert(setIncidents)(data); setIncidentForm(null); notify('Insiden baru dicatat.') }

  const recordVitals = (clientId, vitals) => {
    if (!clientId || !vitals) return
    setClients((list) => list.map((c) => {
      if (c.id !== clientId) return c
      const existing = c.vitals || []
      const last = existing[existing.length - 1]
      const entry = { date: '18/08', sistolik: vitals.sistolik, diastolik: vitals.diastolik, nadi: vitals.nadi }
      // ganti hari yang sama, tambah kalau beda
      const updated = last && last.date === '18/08' ? [...existing.slice(0, -1), entry] : [...existing, entry]
      return { ...c, vitals: updated }
    }))
  }

  const resetData = () => {
    setClients(clientSeed); setCaregivers(caregiverSeed); setVisits(initialVisits); setIncidents(incidentSeed); setFamilyUpdate(INITIAL_FAMILY_UPDATE)
    notify('Data demo direset ke kondisi awal.')
  }

  const askDelete = (kind, id, name) => setDeleteTarget({ kind, id, name })
  const resolveIncident = (id) => { setIncidents((list) => list.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i))); notify('Insiden ditandai selesai.') }
  const confirmDelete = () => {
    if (!deleteTarget) return
    const { kind, id, name } = deleteTarget
    if (kind === 'caregiver') setCaregivers((c) => c.filter((x) => x.id !== id))
    if (kind === 'client') setClients((c) => c.filter((x) => x.id !== id))
    if (kind === 'visit') setVisits((v) => v.filter((x) => x.id !== id))
    notify(`${name} berhasil dihapus.`)
    setDeleteTarget(null)
  }

  const generateDraft = () => {
    setFamilyUpdate({ status: 'draft', text: 'Bapak Hendra menjalani aktivitas pagi dengan baik. Ia mengikuti latihan gerak ringan dan makan dengan cukup. Tidak ada keluhan baru yang dicatat selama kunjungan.' })
    notify('Draf update keluarga dibuat. Silakan tinjau sebelum disetujui.')
  }
  const approveUpdate = () => { setFamilyUpdate((u) => ({ ...u, status: 'approved' })); notify('Update disetujui dan tampil di halaman keluarga.') }

  const exportReport = () => {
    const rows = [['Waktu', 'Klien', 'Caregiver', 'Status', 'Lokasi'], ...visits.map((v) => [v.time, v.client, v.caregiver, v.status, v.location])]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = 'careops-laporan-harian.csv'; link.click(); URL.revokeObjectURL(url)
    notify('Laporan harian berhasil diunduh.')
  }

  const openIncomplete = () => { const v = visits.find((x) => x.caregiver === 'Dewi Lestari' && x.status === 'scheduled') || visits[0]; if (v) setSelectedVisit(v) }

  return (
    <div className="app-shell">
      {isCoordinator && <Sidebar visitCount={visits.filter((v) => v.status === 'scheduled').length} onReset={resetData} />}
      <main className={`main-content ${isCoordinator ? '' : 'no-sidebar'}`}>
        <Topbar incidents={incidents} visits={visits} />
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/koordinator" replace />} />
            <Route path="/koordinator" element={<DashboardPage visits={visits} incidents={incidents} noticeVisible={noticeVisible} onDismissNotice={() => setNoticeVisible(false)} onResolveIncident={resolveIncident} onOpen={setSelectedVisit} onCheckIn={(v) => setStatus(v, 'checked-in')} onSchedule={() => setVisitForm({ visit: null })} />} />
            <Route path="/koordinator/kunjungan" element={<VisitsPage visits={visits} onOpen={setSelectedVisit} onMove={setStatus} onAdd={() => setVisitForm({ visit: null })} onDelete={(v) => askDelete('visit', v.id, v.client)} />} />
            <Route path="/koordinator/klien" element={<ClientsPage clients={clients} onOpen={setSelectedClient} onAdd={() => setClientForm({ client: null })} />} />
            <Route path="/koordinator/caregiver" element={<CaregiversPage caregivers={caregivers} onAdd={() => setCaregiverForm({ caregiver: null })} onEdit={(c) => setCaregiverForm({ caregiver: c })} onDelete={(c) => askDelete('caregiver', c.id, c.name)} />} />
            <Route path="/koordinator/catatan" element={<NotesPage update={familyUpdate} visits={visits} incidents={incidents} onResolveIncident={resolveIncident} onAddIncident={() => setIncidentForm({ incident: null })} generateDraft={generateDraft} approveUpdate={approveUpdate} exportReport={exportReport} onOpen={setSelectedVisit} />} />
            <Route path="/koordinator/database" element={<DatabasePage visits={visits} clients={clients} caregivers={caregivers} />} />
            <Route path="/caregiver" element={<CaregiverPage visits={visits} caregivers={caregivers} onOpen={setSelectedVisit} onCheckIn={(v) => setStatus(v, 'checked-in')} onComplete={(v) => setStatus(v, 'completed')} onToggleChecklist={toggleChecklist} />} />
            <Route path="/keluarga" element={<Navigate to="/keluarga/c2" replace />} />
            <Route path="/keluarga/:clientId" element={<FamilyRoute update={familyUpdate} clients={clients} />} />
            <Route path="*" element={<Navigate to="/koordinator" replace />} />
          </Routes>
        </div>
      </main>
      {selectedVisit && <VisitModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} onCheckIn={() => setStatus(selectedVisit, 'checked-in')} onComplete={() => setStatus(selectedVisit, 'completed')} onToggleChecklist={(i) => toggleChecklist(selectedVisit.id, i)} onSave={(payload) => { updateVisit(selectedVisit.id, { note: payload }); if (payload.vitals) recordVitals(selectedVisit.clientId, payload.vitals); notify('Catatan perawatan tersimpan.') }} onDelete={() => { setSelectedVisit(null); askDelete('visit', selectedVisit.id, selectedVisit.client) }} />}
      {selectedClient && <ClientDrawer client={selectedClient} caregivers={caregivers} onClose={() => setSelectedClient(null)} onEdit={(c) => { setSelectedClient(null); setClientForm({ client: c }) }} onDelete={(c) => { setSelectedClient(null); askDelete('client', c.id, c.name) }} />}
      {caregiverForm && <CaregiverFormModal caregiver={caregiverForm.caregiver} onClose={() => setCaregiverForm(null)} onSave={saveCaregiver} />}
      {clientForm && <ClientFormModal client={clientForm.client} caregivers={caregivers} onClose={() => setClientForm(null)} onSave={saveClient} />}
      {visitForm && <VisitFormModal visit={visitForm.visit} clients={clients} caregivers={caregivers} onClose={() => setVisitForm(null)} onSave={saveVisit} />}
      {incidentForm && <IncidentFormModal clients={clients} onClose={() => setIncidentForm(null)} onSave={saveIncident} />}
      {deleteTarget && <ConfirmModal title={deleteTarget.kind === 'visit' ? 'Hapus kunjungan?' : deleteTarget.kind === 'client' ? 'Hapus klien?' : 'Hapus caregiver?'} message={`"${deleteTarget.name}" akan dihapus permanen dari ruang demo. Tindakan ini tidak bisa dibatalkan.`} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  )
}

function Sidebar({ visitCount, onReset }) {
  const location = useLocation()
  const items = [
    { icon: LayoutDashboard, label: 'Ringkasan', to: '/koordinator' },
    { icon: CalendarDays, label: 'Kunjungan', to: '/koordinator/kunjungan', count: String(visitCount) },
    { icon: UsersRound, label: 'Klien', to: '/koordinator/klien' },
    { icon: UserRound, label: 'Caregiver', to: '/koordinator/caregiver' },
    { icon: NotebookPen, label: 'Catatan & Insiden', to: '/koordinator/catatan', count: '2' },
    { icon: Database, label: 'Database', to: '/koordinator/database' },
  ]
  return (
    <aside className="sidebar">
      <Link to="/koordinator" className="brand"><div className="brand-mark"><HeartPulse size={19} /></div><div><strong>careops</strong><span>INDONESIA</span></div></Link>
      <div className="demo-badge"><span className="pulse-dot" /> Ruang demo</div>
      <nav className="nav-list">
        <p className="nav-label">Workspace</p>
        {items.map((item) => {
          const active = location.pathname === item.to
          return <Link key={item.to} to={item.to} className={`nav-item ${active ? 'active' : ''}`}><item.icon size={18} /><span>{item.label}</span>{item.count && <b>{item.count}</b>}</Link>
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><ShieldCheck size={18} /></div><div><strong>Data simulasi</strong><p>Ruang ini menggunakan data contoh, bukan data pasien nyata.</p></div></div>
        <button className="reset-btn" onClick={onReset}><RotateCcw size={14} /> Reset data demo</button>
        <div className="profile-mini"><div className="avatar avatar-purple">AN</div><div><strong>Andini Nurhaliza</strong><span>Koordinator</span></div><MoreHorizontal size={18} className="muted-icon" /></div>
      </div>
    </aside>
  )
}

function Topbar({ incidents, visits }) {
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const roles = [
    { label: 'Koordinator', to: '/koordinator' },
    { label: 'Caregiver', to: '/caregiver' },
    { label: 'Keluarga', to: '/keluarga/c2' },
  ]
  const current = location.pathname.startsWith('/koordinator') ? 'Koordinator' : location.pathname.startsWith('/caregiver') ? 'Caregiver' : 'Keluarga'
  const openIncidents = incidents.filter((i) => i.status !== 'resolved')
  const incompleteVisits = visits.filter((v) => v.status !== 'completed' && !(v.note && (typeof v.note === 'string' ? v.note : v.note?.text)))
  const notifCount = openIncidents.length + incompleteVisits.length
  return (
    <header className="topbar">
      <div className="mobile-brand"><Link to="/koordinator" className="brand-mark"><HeartPulse size={17} /></Link><Link to="/koordinator"><strong>careops</strong></Link></div>
      <div className="breadcrumb"><span>Ruang demo</span><ArrowRight size={14} /><strong>{current}</strong></div>
      <div className="top-actions">
        <div className="notif-wrap">
          <button className="icon-btn" aria-label="Notifikasi" onClick={() => setNotifOpen((o) => !o)}><Bell size={18} />{notifCount > 0 && <i>{notifCount}</i>}</button>
          {notifOpen && (
            <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="notif-head"><strong>Notifikasi</strong><span>{notifCount} perlu perhatian</span></div>
              {openIncidents.slice(0, 3).map((i) => <Link key={i.id} to="/koordinator/catatan" className="notif-item" onClick={() => setNotifOpen(false)}><div className={`incident-icon ${i.severity === 'tinggi' ? 'red' : i.severity === 'sedang' ? 'amber' : 'blue'}`}><AlertTriangle size={14} /></div><div><strong>{i.title}</strong><span>{i.client} · {i.category}</span></div></Link>)}
              {incompleteVisits.slice(0, 3).map((v) => <Link key={v.id} to="/koordinator/catatan" className="notif-item" onClick={() => setNotifOpen(false)}><div className="incident-icon amber"><Clock3 size={14} /></div><div><strong>Catatan belum lengkap</strong><span>{v.client} · {v.caregiver}</span></div></Link>)}
              {notifCount === 0 && <div className="notif-empty">Tidak ada notifikasi baru.</div>}
            </div>
          )}
        </div>
        <div className="role-nav">{roles.map((r) => <Link key={r.to} to={r.to} className={current === r.label ? 'active' : ''}>{r.label}</Link>)}</div>
      </div>
    </header>
  )
}

function PageHeader({ eyebrow, title, description, action, onAction, children }) { return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div><div className="header-actions">{children}{action && <button className="btn primary" onClick={onAction}><Plus size={17} /> {action}</button>}</div></div> }
function PanelTitle({ title, action, hint, actionTo, onAction }) { return <div className="panel-title"><h2>{title}</h2>{hint && <span className="panel-hint">{hint}</span>}{action && (actionTo ? <Link to={actionTo} className="text-btn">{action}<ArrowRight size={14} /></Link> : <button className="text-btn" onClick={onAction}>{action}<ArrowRight size={14} /></button>)}</div> }
function Metric({ icon: Icon, label, value, foot, tone, delta }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19} /></div><span>{label}</span><strong>{value}</strong><small>{foot}</small>{delta && <span className={`metric-delta ${delta > 0 ? 'up' : 'down'}`}>{delta > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(delta)}%</span>}</div> }

function DashboardPage({ visits, incidents, noticeVisible, onDismissNotice, onResolveIncident, onOpen, onCheckIn, onSchedule }) {
  const completed = visits.filter((v) => v.status === 'completed').length
  const ongoing = visits.filter((v) => v.status === 'checked-in').length
  const scheduled = visits.filter((v) => v.status === 'scheduled').length
  const activeVisit = visits.find((v) => v.status === 'checked-in')
  const openIncidents = incidents.filter((i) => i.status !== 'resolved')
  return <>
    <PageHeader eyebrow="Selasa, 18 Agustus 2026" title="Selamat pagi, Andini" description="Berikut gambaran operasional kunjungan hari ini." action="Jadwalkan kunjungan" onAction={onSchedule} />
    {noticeVisible && <div className="notice"><div className="notice-symbol"><ShieldCheck size={18} /></div><div><strong>Ruang demo CareOps Indonesia</strong><span>Gunakan navigasi peran di kanan atas untuk melihat sisi coordinator, caregiver, dan keluarga.</span></div><button aria-label="Tutup" onClick={onDismissNotice}><X size={16} /></button></div>}
    <div className="metrics-grid">
      <Metric icon={CalendarDays} label="Kunjungan hari ini" value={String(visits.length)} foot={`${completed} selesai · ${ongoing} berlangsung · ${scheduled} terjadwal`} tone="blue" delta={8} />
      <Metric icon={CheckCircle2} label="Tingkat penyelesaian" value={`${Math.round((completed / Math.max(1, visits.length)) * 100)}%`} foot="Dari seluruh kunjungan" tone="green" delta={4} />
      <Metric icon={AlertTriangle} label="Perlu ditinjau" value="2" foot="1 catatan · 1 penugasan" tone="amber" />
      <Metric icon={Clock3} label="Kelengkapan catatan" value="86%" foot="Naik 8% dari kemarin" tone="purple" delta={8} />
    </div>
    <div className="content-grid two-thirds">
      <section className="panel"><PanelTitle title="Tren kunjungan" hint="7 hari terakhir" /><TrendChart data={weeklyTrend} /><div className="trend-legend"><span><i style={{ background: '#3666f6' }} />Kunjungan</span><span><i style={{ background: '#50b89c' }} />Selesai</span></div></section>
      <section className="panel"><PanelTitle title="Status kunjungan" hint="7 hari terakhir" /><StatusDonut data={statusDistribution} /><div className="donut-legend">{statusDistribution.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}<b>{s.value}</b></span>)}</div></section>
    </div>
    <div className="content-grid two-thirds bottom-grid">
      <section className="panel schedule-panel"><PanelTitle title="Jadwal hari ini" action="Lihat semua" actionTo="/koordinator/database" /><div className="schedule-list">{visits.map((visit) => <VisitRow key={visit.id} visit={visit} onOpen={onOpen} onCheckIn={onCheckIn} />)}</div></section>
      <section className="panel"><PanelTitle title="Beban caregiver" hint="Minggu ini" /><LoadBar data={caregiverLoad} /></section>
    </div>
    <div className="content-grid two-thirds bottom-grid">
      <section className="panel"><PanelTitle title="Perlu perhatian" action="Semua catatan" actionTo="/koordinator/catatan" /><div className="incident-list">{openIncidents.slice(0, 3).map((item) => <Incident key={item.id} {...item} status={item.status} />)}</div>{openIncidents.length === 0 && <div className="kanban-empty">Tidak ada insiden terbuka.</div>}</section>
      <section className="panel care-quality"><PanelTitle title="Kualitas pendampingan" hint="Minggu ini" /><div className="quality-score"><div className="score-ring"><strong>94</strong><span>/100</span></div><div><strong className="score-label">Baik sekali</strong><p>Indikator operasional stabil. Ada ruang perbaikan pada kelengkapan catatan kunjungan pagi.</p></div></div><div className="progress-row"><span>Kunjungan tepat waktu</span><strong>96%</strong><div className="progress"><i style={{ width: '96%' }} /></div></div><div className="progress-row"><span>Catatan lengkap</span><strong>86%</strong><div className="progress"><i style={{ width: '86%' }} /></div></div><div className="progress-row"><span>Kepuasan keluarga</span><strong>4.8</strong><div className="progress"><i style={{ width: '96%' }} /></div></div></section>
    </div>
    {activeVisit && <div className="flow-hint"><div className="flow-icon"><Sparkles size={19} /></div><div><strong>Alur contoh sedang berlangsung</strong><span>{activeVisit.caregiver} sedang mencatat kunjungan {activeVisit.client}. Buka menu <b>Catatan & Insiden</b> untuk meninjau draf update keluarga.</span></div><ArrowRight size={18} /></div>}
  </>
}

function VisitRow({ visit, onOpen, onCheckIn }) {
  const meta = { scheduled: ['Terjadwal', 'slate'], 'checked-in': ['Berlangsung', 'blue'], completed: ['Selesai', 'green'] }[visit.status]
  return (
    <button className="visit-row" onClick={() => onOpen(visit)}>
      <div className="visit-time"><strong>{visit.time.split(' – ')[0]}</strong><span>{visit.time.split(' – ')[1]}</span></div>
      <div className={`visit-line ${visit.status}`} />
      <div className={`avatar avatar-${visit.status === 'completed' ? 'green' : visit.status === 'checked-in' ? 'blue' : 'purple'}`}>{visit.initials}</div>
      <div className="visit-info"><strong>{visit.client}</strong><span>{visit.type} · {visit.caregiver}</span><small><MapPin size={10} /> {visit.location}</small></div>
      <span className={`status-pill ${meta[1]}`}>{meta[0]}</span>
      {visit.status === 'scheduled' && <span className="quick-action" onClick={(e) => { e.stopPropagation(); onCheckIn(visit) }}>Mulai</span>}
    </button>
  )
}

function Incident({ title, detail, time, severity, status, onResolve }) {
  const tone = { tinggi: 'red', sedang: 'amber', rendah: 'blue', resolved: 'green' }[severity] || 'blue'
  const label = { tinggi: 'Tinggi', sedang: 'Sedang', rendah: 'Rendah' }[severity] || severity
  const resolved = status === 'resolved'
  return <div className="incident"><div className={`incident-icon ${tone}`}><AlertTriangle size={17} /></div><div><strong>{title}</strong><span>{detail}</span><small>{time}</small></div>{resolved ? <span className="sev-pill green">Selesai</span> : (onResolve ? <button className="resolve-btn" onClick={onResolve}>Selesai</button> : <span className={`sev-pill ${tone}`}>{label}</span>)}</div>
}

function ClientsPage({ clients, onOpen, onAdd }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const filtered = clients.filter((c) => `${c.name} ${c.city} ${c.careType}`.toLowerCase().includes(search.toLowerCase())).filter((c) => filter === 'Semua' ? true : filter === 'Perlu perhatian' ? c.statusTone === 'amber' : c.statusTone === 'green')
  return <>
    <PageHeader eyebrow="Data klien" title="Klien" description="Daftar klien beserta rencana dan status pendampingan." action="Tambah klien" onAction={onAdd} />
    <div className="toolbar">
      <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, lokasi, atau layanan..." /></div>
      <div className="filter-pills">{['Semua', 'Perlu perhatian', 'Stabil'].map((f) => <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
    </div>
    <div className="client-cards">{filtered.map((client) => <ClientCard key={client.id} client={client} onOpen={() => onOpen(client)} />)}</div>
    {filtered.length === 0 && <div className="empty-state"><Search size={22} /><p>Tidak ada klien yang cocok dengan pencarian.</p></div>}
  </>
}

function ClientCard({ client, onOpen }) {
  return (
    <button className="client-card" onClick={onOpen}>
      <div className="client-card-top"><div className={`avatar avatar-${client.statusTone}`}>{client.initials}</div><span className={`status-pill ${client.statusTone}`}>{client.status}</span><MoreHorizontal size={18} className="muted-icon" /></div>
      <h3>{client.name}</h3><p>{client.age} tahun · {client.city}</p>
      <div className="client-card-detail"><span>Layanan</span><strong>{client.careType}</strong></div>
      <div className="client-card-detail"><span>Caregiver</span><strong>{client.caregiver}</strong></div>
      <div className="client-card-detail"><span>Kondisi</span><strong className="cond-list">{client.conditions.join(' · ')}</strong></div>
      <div className="client-card-footer"><span>Kunjungan berikutnya</span><strong>{client.nextVisit}</strong></div>
    </button>
  )
}

function CaregiversPage({ caregivers, onAdd, onEdit, onDelete }) {
  return <>
    <PageHeader eyebrow="Tim pendamping" title="Caregiver" description="Pantau penugasan, beban kerja, dan ketersediaan tim." action="Tambah caregiver" onAction={onAdd} />
    <div className="caregiver-grid">{caregivers.map((person) => {
      const load = caregiverLoad.find((l) => l.name === person.name.split(' ')[0])
      return (
        <div className="caregiver-card" key={person.id}>
          <div className="caregiver-top"><div className={`avatar avatar-${person.color}`}>{person.initials}</div><span className={`status-pill ${person.tone}`}>{person.status}</span></div>
          <h3>{person.name}</h3><p>{person.role} · {person.specialty}</p>
          <div className="rating-row"><span className="stars">★★★★★</span><strong>{person.rating}</strong></div>
          <div className="caregiver-stat"><span>Kunjungan hari ini</span><strong>{person.visitsToday}</strong></div>
          <div className="caregiver-stat"><span>Selesai</span><strong>{person.completedToday}</strong></div>
          <div className="caregiver-stat"><span>Beban minggu ini</span><strong>{load ? load.kunjungan : 0} kunjungan</strong></div>
          <div className="card-actions"><button className="outline-btn" onClick={() => onEdit(person)}><Pencil size={13} /> Edit</button><button className="danger-icon" aria-label="Hapus caregiver" onClick={() => onDelete(person)}><Trash2 size={15} /></button></div>
        </div>
      )
    })}</div>
    {caregivers.length === 0 && <div className="empty-state"><UserRound size={22} /><p>Belum ada caregiver. Tambahkan satu untuk memulai.</p></div>}
  </>
}

function VisitsPage({ visits, onOpen, onMove, onAdd, onDelete }) {
  const columns = [
    { key: 'scheduled', label: 'Terjadwal', tone: 'slate' },
    { key: 'checked-in', label: 'Berlangsung', tone: 'blue' },
    { key: 'completed', label: 'Selesai', tone: 'green' },
  ]
  return <>
    <PageHeader eyebrow="Operasional" title="Kunjungan" description="Atur dan pantau status kunjungan dalam satu papan kerja." action="Jadwalkan kunjungan" onAction={onAdd} />
    <div className="kanban-board">
      {columns.map((col) => (
        <div className="kanban-col" key={col.key}>
          <div className="kanban-head"><span className={`kanban-dot ${col.tone}`} />{col.label}<b>{visits.filter((v) => v.status === col.key).length}</b></div>
          <div className="kanban-cards">
            {visits.filter((v) => v.status === col.key).map((v) => (
              <div className="kanban-card" key={v.id}>
                <div className="kanban-card-top"><span className="kanban-time"><Clock3 size={13} /> {v.time}</span><button className="muted-icon kanban-del" onClick={() => onDelete(v)} aria-label="Hapus kunjungan"><Trash2 size={14} /></button></div>
                <div className="kanban-client" onClick={() => onOpen(v)}><div className={`avatar avatar-${col.tone === 'green' ? 'green' : col.tone === 'blue' ? 'blue' : 'purple'} small`}>{v.initials}</div><div><strong>{v.client}</strong><span>{v.type}</span></div></div>
                <div className="kanban-meta"><MapPin size={12} /> {v.location} · {v.caregiver}</div>
                {v.status === 'scheduled' && <button className="btn primary full sm" onClick={() => onMove(v, 'checked-in')}>Mulai kunjungan</button>}
                {v.status === 'checked-in' && <button className="btn secondary full sm" onClick={() => onMove(v, 'completed')}><Check size={15} /> Selesaikan</button>}
              </div>
            ))}
            {visits.filter((v) => v.status === col.key).length === 0 && <div className="kanban-empty">Tidak ada kunjungan</div>}
          </div>
        </div>
      ))}
    </div>
  </>
}

function NotesPage({ update, visits, incidents, onResolveIncident, onAddIncident, generateDraft, approveUpdate, exportReport, onOpen }) {
  const [filter, setFilter] = useState('semua')
  const [helpOpen, setHelpOpen] = useState(false)
  const noteText = (v) => { const n = v.note; return typeof n === 'string' ? n : (n?.text || '') }
  const noteObj = (v) => { const n = v.note; return typeof n === 'string' ? { text: n } : (n || {}) }
  const savedNotes = visits.filter((v) => noteText(v).trim())
  const incomplete = visits.filter((v) => v.status !== 'completed' && !noteText(v).trim())
  const openIncidents = incidents.filter((i) => i.status !== 'resolved')
  return <>
    <PageHeader eyebrow="Catatan & komunikasi" title="Catatan perawatan" description="Tinjau catatan caregiver, kelola insiden, dan siapkan update keluarga."><button className="btn secondary" onClick={exportReport}><FileText size={16} /> Unduh laporan</button></PageHeader>
    <div className="content-grid notes-grid">
      <section className="panel">
        <PanelTitle title="Catatan terbaru" action={filter === 'semua' ? 'Belum lengkap' : 'Semua'} onAction={() => setFilter((f) => (f === 'semua' ? 'belum' : 'semua'))} />
        {filter === 'semua' && savedNotes.map((v) => {
          const o = noteObj(v)
          return <div className="note-card" key={v.id}>
            <div className="note-card-header"><div className="avatar avatar-blue">{v.initials}</div><div><strong>{v.caregiver}</strong><span>Hari ini · {v.client}</span></div><span className={`status-pill ${v.status === 'completed' ? 'green' : 'blue'}`}>{v.status === 'completed' ? 'Selesai' : 'Ditinjau'}</span></div>
            <p>{o.text}</p>
            <div className="note-tags">{o.condition && <span><Check size={13} /> {o.condition}</span>}{o.meal && <span><Check size={13} /> {o.meal}</span>}{o.mood && <span><Check size={13} /> {o.mood}</span>}</div>
          </div>
        })}
        {filter === 'belum' && incomplete.map((v) => <div className="note-card incomplete" key={v.id}><div className="note-card-header"><div className="avatar avatar-purple">{v.initials}</div><div><strong>{v.caregiver}</strong><span>Hari ini · {v.client}</span></div><span className="status-pill amber">Belum lengkap</span></div><p>Catatan kunjungan belum dikirim. Lengkapi sebelum pergantian shift.</p><button className="text-btn" onClick={() => onOpen(v)}>Lengkapi catatan <ArrowRight size={14} /></button></div>)}
        {((filter === 'semua' && savedNotes.length === 0) || (filter === 'belum' && incomplete.length === 0)) && <div className="kanban-empty">{filter === 'semua' ? 'Belum ada catatan tersimpan.' : 'Semua catatan sudah lengkap.'}</div>}
        <div className="incident-divider" />
        <PanelTitle title="Insiden & tindak lanjut" hint={`${openIncidents.length} terbuka`} action="Tambah" onAction={onAddIncident} />
        <div className="incident-list">{incidents.map((item) => <Incident key={item.id} {...item} status={item.status} onResolve={item.status === 'resolved' ? undefined : () => onResolveIncident(item.id)} />)}</div>
      </section>
      <section className="panel update-panel">
        <PanelTitle title="Update untuk keluarga" action={helpOpen ? 'Tutup bantuan' : 'Bantuan'} onAction={() => setHelpOpen((h) => !h)} />
        {helpOpen && <div className="helper-card"><ShieldCheck size={15} /><p>Update keluarga adalah ringkasan singkat dari catatan kunjungan untuk dibagikan ke keluarga klien. Buat draf, tinjau isinya, lalu setujui agar tampil di halaman keluarga.</p></div>}
        <div className={`review-status ${update.status}`}><div className="status-check">{update.status === 'approved' ? <Check size={16} /> : <Sparkles size={16} />}</div><div><strong>{update.status === 'approved' ? 'Sudah disetujui' : 'Draf siap ditinjau'}</strong><span>{update.status === 'approved' ? 'Tampil di halaman keluarga.' : 'Baca kembali sebelum membagikan.'}</span></div></div>
        <label className="field-label">Isi update</label>
        <textarea className="update-text" value={update.text} readOnly />
        <p className="helper"><ShieldCheck size={14} /> Draf ini dibuat dari catatan kunjungan. Tinjau isinya sebelum disetujui.</p>
        <div className="button-row"><button className="btn secondary" onClick={generateDraft}><Sparkles size={16} /> Buat draf</button><button className="btn primary" onClick={approveUpdate}><Check size={16} /> Setujui update</button></div>
        <div className="handover"><div className="handover-icon"><ArrowRight size={16} /></div><div><strong>Ringkasan pergantian shift</strong><p>Hendra dapat melanjutkan aktivitas ringan sesuai toleransi. Perhatikan asupan makan siang dan catat perubahan kondisi umum.</p></div></div>
      </section>
    </div>
    <div className="privacy-strip"><ShieldCheck size={17} /><span>CareOps bukan alat diagnosis. Semua informasi di halaman ini bersifat operasional dan menggunakan data simulasi.</span></div>
  </>
}

function CaregiverPage({ visits, caregivers, onOpen, onCheckIn, onComplete, onToggleChecklist }) {
  const [caregiverName, setCaregiverName] = useState(caregivers[0]?.name || 'Dewi Lestari')
  const own = visits.filter((v) => v.caregiver === caregiverName)
  const done = own.filter((v) => v.status === 'completed').length
  const progress = own.length ? Math.round((done / own.length) * 100) : 0
  const firstName = caregiverName.split(' ')[0]
  return <div className="caregiver-view">
    <div className="caregiver-selector"><span>Lihat sebagai</span><select value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)}>{caregivers.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}</select><ChevronDown size={14} /></div>
    <div className="caregiver-greeting"><p className="eyebrow">Selasa, 18 Agustus 2026</p><h1>Selamat pagi, {firstName}</h1><p>Siap mendampingi {own.length} kunjungan hari ini?</p></div>
    <div className="caregiver-stat-banner"><div><span>Kunjungan hari ini</span><strong>{own.length}</strong></div><div className="banner-divider" /><div><span>Selesai</span><strong>{done}</strong></div><div className="banner-progress"><i style={{ width: `${progress}%` }} /></div></div>
    <div className="mobile-section-title"><h2>Tugas hari ini</h2><span>{own.length} kunjungan</span></div>
    <div className="mobile-visits">
      {own.map((visit) => {
        const doneCount = (visit.checklist || []).filter((c) => c.done).length
        const total = (visit.checklist || []).length
        return (
          <div className={`mobile-visit-card ${visit.status}`} key={visit.id}>
            <div className="mobile-visit-top"><span className="mobile-time"><Clock3 size={15} /> {visit.time}</span><span className={`status-pill ${visit.status === 'completed' ? 'green' : visit.status === 'checked-in' ? 'blue' : 'slate'}`}>{visit.status === 'completed' ? 'Selesai' : visit.status === 'checked-in' ? 'Berlangsung' : 'Terjadwal'}</span></div>
            <div className="mobile-client"><div className="avatar avatar-purple">{visit.initials}</div><div><h3>{visit.client}</h3><p>{visit.type}</p><span><MapPin size={11} /> {visit.location}</span></div></div>
            {visit.status !== 'scheduled' && total > 0 && (
              <div className="checklist-block">
                <div className="checklist-head"><span>Daftar tugas</span><b>{doneCount}/{total}</b></div>
                {visit.checklist.map((c, i) => <button key={c.label} className={`check-item ${c.done ? 'done' : ''}`} onClick={() => onToggleChecklist(visit.id, i)}><span className="check-box">{c.done && <Check size={12} />}</span><span>{c.label}</span></button>)}
              </div>
            )}
            {visit.status === 'scheduled' && <button className="btn primary full" onClick={() => onCheckIn(visit)}>Mulai kunjungan <ArrowRight size={16} /></button>}
            {visit.status === 'checked-in' && <div className="mobile-actions"><button className="btn secondary" onClick={() => onOpen(visit)}><FileText size={16} /> Isi catatan</button><button className="btn primary" onClick={() => onComplete(visit)}><CheckCircle2 size={16} /> Selesaikan</button></div>}
            {visit.status === 'completed' && <div className="completed-note"><CheckCircle2 size={16} /> Catatan sudah dikirim</div>}
          </div>
        )
      })}
    </div>
    {own.length === 0 && <div className="empty-state"><CalendarDays size={22} /><p>Tidak ada kunjungan terjadwal untuk {firstName}.</p></div>}
    <div className="mobile-safety"><ShieldCheck size={18} /><div><strong>Pengingat pendampingan</strong><span>Catat kondisi yang terlihat dan kegiatan yang dilakukan. Jangan memasukkan diagnosis atau saran obat.</span></div></div>
  </div>
}

function FamilyRoute({ update, clients }) {
  const { clientId } = useParams()
  const client = clients.find((c) => c.id === clientId) || clients[0]
  return client ? <FamilyPage update={update} client={client} /> : <Navigate to="/koordinator" replace />
}

function FamilyPage({ update, client }) {
  return <div className="family-view">
    <div className="family-hero"><p className="eyebrow">Ruang keluarga · Demo</p><h1>Update pendampingan<br /><em>{client.name}</em></h1><p>Informasi ringkas dari tim pendamping hari ini.</p></div>
    <div className="family-card">
      <div className="family-card-top"><div className="avatar avatar-blue">{client.initials}</div><div><strong>{client.name}</strong><span>Pembaruan terakhir · Hari ini, 12.15</span></div><span className="approved-check"><Check size={14} /></span></div>
      <div className="family-update-content"><div className="quote-mark">“</div><p>{update.status === 'approved' ? update.text : 'Update hari ini sedang ditinjau oleh koordinator. Informasi akan tampil setelah disetujui.'}</p></div>
      <div className="family-card-footer"><span><CheckCircle2 size={15} /> {update.status === 'approved' ? 'Disetujui koordinator' : 'Menunggu persetujuan'}</span><span>Hari ini</span></div>
    </div>
    <div className="family-grid">
      <section className="family-panel">
        <div className="family-panel-head"><h3><Activity size={16} /> Tanda vital</h3><span>7 hari terakhir</span></div>
        <div className="vital-legend"><span><i style={{ background: '#3666f6' }} />Sistolik</span><span><i style={{ background: '#50b89c' }} />Diastolik</span></div>
        <VitalsChart data={client.vitals} />
        <div className="vital-pulse"><div><strong>Denyut nadi</strong><span>rata-rata 7 hari</span></div><b>{Math.round(client.vitals.reduce((s, v) => s + v.nadi, 0) / client.vitals.length)} <small>bpm</small></b></div>
        <VitalsPulse data={client.vitals} />
      </section>
      <section className="family-panel">
        <div className="family-panel-head"><h3><CalendarDays size={16} /> Jadwal mendatang</h3></div>
        <div className="family-schedule"><div className="fs-date"><strong>Besok</strong><span>Rab, 19 Agustus</span></div><div className="fs-item"><Clock3 size={15} /><div><strong>08.00 – 10.00</strong><span>{client.careType} · {client.caregiver}</span></div></div></div>
        <div className="family-schedule"><div className="fs-date"><strong>Kamis</strong><span>20 Agustus</span></div><div className="fs-item"><Clock3 size={15} /><div><strong>08.00 – 10.00</strong><span>{client.careType} · {client.caregiver}</span></div></div></div>
        <div className="family-team"><div className="family-panel-head"><h3><UserRound size={16} /> Tim pendamping</h3></div><div className="team-row"><div className="avatar avatar-purple">{client.initials}</div><div><strong>{client.caregiver}</strong><span>Caregiver utama</span></div><span className="team-ok"><Check size={13} /></span></div></div>
      </section>
    </div>
    <div className="family-grid">
      <section className="family-panel">
        <div className="family-panel-head"><h3><ListChecks size={16} /> Rencana pendampingan</h3></div>
        <ul className="care-plan-list">{client.carePlan.map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul>
      </section>
      <section className="family-panel">
        <div className="family-panel-head"><h3><Clock3 size={16} /> Riwayat pendampingan</h3></div>
        <div className="timeline">{client.visitHistory.map((h) => <div className="tl-item" key={h.date}><div className="tl-dot" /><div className="tl-body"><div className="tl-top"><strong>{h.date}</strong><span>{h.caregiver}</span></div><p>{h.note}</p></div></div>)}</div>
      </section>
    </div>
    <div className="family-contact"><MessageCircle size={18} /><div><strong>Butuh bantuan?</strong><span>Hubungi {client.familyContact.name} atau koordinator CareOps untuk pertanyaan seputar jadwal dan pendampingan.</span></div><ArrowRight size={17} /></div>
    <p className="demo-footnote"><ShieldCheck size={14} /> Tampilan demo menggunakan data simulasi. Bukan informasi medis atau diagnosis.</p>
  </div>
}

function DatabasePage({ visits, clients, caregivers }) {
  const [tab, setTab] = useState('klien')
  const tabs = [
    { key: 'klien', label: 'Klien', count: clients.length },
    { key: 'caregiver', label: 'Caregiver', count: caregivers.length },
    { key: 'kunjungan', label: 'Kunjungan', count: visits.length },
    { key: 'insiden', label: 'Insiden', count: incidentSeed.length },
  ]
  return <>
    <PageHeader eyebrow="Contoh data" title="Database" description="Seluruh data contoh yang dipakai di ruang demo ini, dalam satu tempat." />
    <div className="db-tabs">{tabs.map((t) => <button key={t.key} className={`db-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}<b>{t.count}</b></button>)}</div>
    <div className="panel db-panel">
      {tab === 'klien' && <KlienTable clients={clients} />}
      {tab === 'caregiver' && <CaregiverTable caregivers={caregivers} />}
      {tab === 'kunjungan' && <KunjunganTable visits={visits} />}
      {tab === 'insiden' && <InsidenTable />}
    </div>
    <div className="privacy-strip"><ShieldCheck size={17} /><span>Seluruh data di halaman ini adalah contoh (simulasi), bukan data pasien nyata.</span></div>
  </>
}

function KlienTable({ clients }) {
  return <div className="table-scroll"><table className="data-table">
    <thead><tr><th>Klien</th><th>Lokasi</th><th>Layanan</th><th>Tingkat</th><th>Kondisi</th><th>Caregiver</th><th>Status</th><th>Kunjungan berikutnya</th></tr></thead>
    <tbody>{clients.map((c) => <tr key={c.id}>
      <td><div className="cell-person"><div className={`avatar avatar-${c.statusTone} small`}>{c.initials}</div><div><strong>{c.name}</strong><span>{c.age} th · {c.gender}</span></div></div></td>
      <td className="nowrap">{c.city}</td>
      <td>{c.careType}</td>
      <td>{c.careLevel}</td>
      <td className="cond-cell">{c.conditions.join(', ')}</td>
      <td className="nowrap">{c.caregiver}</td>
      <td><span className={`status-pill ${c.statusTone}`}>{c.status}</span></td>
      <td className="nowrap">{c.nextVisit}</td>
    </tr>)}</tbody>
  </table></div>
}

function CaregiverTable({ caregivers }) {
  return <div className="table-scroll"><table className="data-table">
    <thead><tr><th>Caregiver</th><th>Peran</th><th>Spesialisasi</th><th>Rating</th><th>Kunjungan hari ini</th><th>Selesai</th><th>Beban minggu ini</th><th>Status</th></tr></thead>
    <tbody>{caregivers.map((p) => {
      const load = caregiverLoad.find((l) => l.name === p.name.split(' ')[0])
      return <tr key={p.id}>
        <td><div className="cell-person"><div className={`avatar avatar-${p.color} small`}>{p.initials}</div><div><strong>{p.name}</strong></div></div></td>
        <td>{p.role}</td>
        <td>{p.specialty}</td>
        <td><span className="rating-inline">★ {p.rating}</span></td>
        <td>{p.visitsToday}</td>
        <td>{p.completedToday}</td>
        <td>{load ? load.kunjungan : 0}</td>
        <td><span className={`status-pill ${p.tone}`}>{p.status}</span></td>
      </tr>
    })}</tbody>
  </table></div>
}

function KunjunganTable({ visits }) {
  const metaMap = { scheduled: ['Terjadwal', 'slate'], 'checked-in': ['Berlangsung', 'blue'], completed: ['Selesai', 'green'] }
  return <div className="table-scroll"><table className="data-table">
    <thead><tr><th>Waktu</th><th>Klien</th><th>Layanan</th><th>Caregiver</th><th>Lokasi</th><th>Status</th><th>Daftar tugas</th></tr></thead>
    <tbody>{visits.map((v) => {
      const meta = metaMap[v.status]
      const done = (v.checklist || []).filter((c) => c.done).length
      const total = (v.checklist || []).length
      return <tr key={v.id}>
        <td className="nowrap">{v.time}</td>
        <td><strong>{v.client}</strong></td>
        <td>{v.type}</td>
        <td className="nowrap">{v.caregiver}</td>
        <td className="nowrap">{v.location}</td>
        <td><span className={`status-pill ${meta[1]}`}>{meta[0]}</span></td>
        <td>{total ? `${done}/${total}` : '—'}</td>
      </tr>
    })}</tbody>
  </table></div>
}

function InsidenTable() {
  const sev = { tinggi: ['red', 'Tinggi'], sedang: ['amber', 'Sedang'], rendah: ['blue', 'Rendah'] }
  const stat = { open: ['Terbuka', 'amber'], review: ['Ditinjau', 'blue'], resolved: ['Selesai', 'green'] }
  return <div className="table-scroll"><table className="data-table">
    <thead><tr><th>Insiden</th><th>Klien</th><th>Kategori</th><th>Tingkat</th><th>Status</th><th>Detail</th><th>Waktu</th></tr></thead>
    <tbody>{incidentSeed.map((i) => {
      const [tone, label] = sev[i.severity] || ['blue', i.severity]
      const [stLabel, stTone] = stat[i.status] || ['Terbuka', 'amber']
      return <tr key={i.id}>
        <td><strong>{i.title}</strong></td>
        <td className="nowrap">{i.client}</td>
        <td>{i.category}</td>
        <td><span className={`sev-pill ${tone}`}>{label}</span></td>
        <td><span className={`status-pill ${stTone}`}>{stLabel}</span></td>
        <td className="cond-cell">{i.detail}</td>
        <td className="nowrap">{i.time}</td>
      </tr>
    })}</tbody>
  </table></div>
}

function ConfirmModal({ title, message, confirmLabel = 'Hapus', onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}><div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-icon"><Trash2 size={22} /></div>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="button-row"><button className="btn secondary" onClick={onCancel}>Batal</button><button className="btn danger" onClick={onConfirm}>{confirmLabel}</button></div>
    </div></div>
  )
}

function CaregiverFormModal({ caregiver, onClose, onSave }) {
  const editing = Boolean(caregiver)
  const [name, setName] = useState(caregiver?.name || '')
  const [role, setRole] = useState(caregiver?.role || 'Caregiver')
  const [specialty, setSpecialty] = useState(caregiver?.specialty || '')
  const [rating, setRating] = useState(caregiver?.rating || 4.8)
  const [status, setStatus] = useState(caregiver?.status || 'Siap ditugaskan')
  const submit = () => {
    if (!name.trim()) return
    onSave({
      id: caregiver?.id || uid(),
      name: name.trim(),
      initials: initialsOf(name),
      role, specialty,
      rating: Number(rating) || 4.8,
      visitsToday: caregiver?.visitsToday || 0,
      completedToday: caregiver?.completedToday || 0,
      status, tone: STATUS_TONE[status] || 'slate',
      color: caregiver?.color || ['purple', 'blue', 'orange', 'pink', 'slate'][Math.floor(Math.random() * 5)],
    })
  }
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">{editing ? 'Edit' : 'Tambah'} caregiver</p><h2>{editing ? caregiver.name : 'Caregiver baru'}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="field"><label className="field-label">Nama lengkap</label><input className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Rina Maharani" /></div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Peran</label><select className="text-input" value={role} onChange={(e) => setRole(e.target.value)}>{['Caregiver', 'Caregiver senior', 'Caregiver pengganti'].map((r) => <option key={r}>{r}</option>)}</select></div>
        <div className="field"><label className="field-label">Spesialisasi</label><input className="text-input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Contoh: Perawatan lansia" /></div>
      </div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Rating</label><input className="text-input" type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} /></div>
        <div className="field"><label className="field-label">Status</label><select className="text-input" value={status} onChange={(e) => setStatus(e.target.value)}>{['Bertugas', 'Sedang kunjungan', 'Siap ditugaskan', 'Istirahat'].map((s) => <option key={s}>{s}</option>)}</select></div>
      </div>
      <div className="button-row"><button className="btn secondary" onClick={onClose}>Batal</button><button className="btn primary" onClick={submit} disabled={!name.trim()}><Check size={16} /> {editing ? 'Simpan perubahan' : 'Tambah caregiver'}</button></div>
    </div></div>
  )
}

function ClientFormModal({ client, caregivers, onClose, onSave }) {
  const editing = Boolean(client)
  const [name, setName] = useState(client?.name || '')
  const [age, setAge] = useState(client?.age || '')
  const [gender, setGender] = useState(client?.gender || 'Perempuan')
  const [city, setCity] = useState(client?.city || '')
  const [careType, setCareType] = useState(client?.careType || 'Perawatan harian')
  const [careLevel, setCareLevel] = useState(client?.careLevel || 'Sedang')
  const [conditions, setConditions] = useState((client?.conditions || []).join(', '))
  const [caregiver, setCaregiver] = useState(client?.caregiver || caregivers[0]?.name || '')
  const [status, setStatus] = useState(client?.status || 'Stabil')
  const [fcName, setFcName] = useState(client?.familyContact?.name || '')
  const [fcRelation, setFcRelation] = useState(client?.familyContact?.relation || 'Anak')
  const [fcPhone, setFcPhone] = useState(client?.familyContact?.phone || '')
  const [carePlanText, setCarePlanText] = useState((client?.carePlan || []).join('\n'))
  const submit = () => {
    if (!name.trim()) return
    onSave({
      id: client?.id || uid(),
      name: name.trim(), initials: initialsOf(name),
      age: Number(age) || 0, gender, city,
      careType, careLevel,
      conditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
      caregiver, status, statusTone: status === 'Perlu perhatian' ? 'amber' : 'green',
      nextVisit: client?.nextVisit || 'Belum dijadwalkan',
      familyContact: { name: fcName.trim() || '—', relation: fcRelation.trim() || '—', phone: fcPhone.trim() || '—' },
      carePlan: carePlanText.split('\n').map((s) => s.trim()).filter(Boolean),
      vitals: client?.vitals || defaultVitals(),
      visitHistory: client?.visitHistory || [],
    })
  }
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">{editing ? 'Edit' : 'Tambah'} klien</p><h2>{editing ? client.name : 'Klien baru'}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="field"><label className="field-label">Nama lengkap</label><input className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Ibu Sari Wulandari" /></div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Usia</label><input className="text-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="72" /></div>
        <div className="field"><label className="field-label">Jenis kelamin</label><select className="text-input" value={gender} onChange={(e) => setGender(e.target.value)}>{['Perempuan', 'Laki-laki'].map((g) => <option key={g}>{g}</option>)}</select></div>
      </div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Kota / area</label><input className="text-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Contoh: Kebayoran Baru" /></div>
        <div className="field"><label className="field-label">Layanan</label><input className="text-input" value={careType} onChange={(e) => setCareType(e.target.value)} placeholder="Contoh: Perawatan harian" /></div>
      </div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Tingkat perawatan</label><select className="text-input" value={careLevel} onChange={(e) => setCareLevel(e.target.value)}>{['Rendah', 'Sedang', 'Tinggi'].map((l) => <option key={l}>{l}</option>)}</select></div>
        <div className="field"><label className="field-label">Status</label><select className="text-input" value={status} onChange={(e) => setStatus(e.target.value)}>{['Stabil', 'Perlu perhatian'].map((s) => <option key={s}>{s}</option>)}</select></div>
      </div>
      <div className="field"><label className="field-label">Kondisi (pisahkan dengan koma)</label><input className="text-input" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Contoh: Hipertensi terkontrol, Mobilitas ringan" /></div>
      <div className="field"><label className="field-label">Caregiver utama</label><select className="text-input" value={caregiver} onChange={(e) => setCaregiver(e.target.value)}>{caregivers.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
      <div className="modal-section-head"><UserRound size={15} /><strong>Kontak keluarga</strong></div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Nama kontak</label><input className="text-input" value={fcName} onChange={(e) => setFcName(e.target.value)} placeholder="Contoh: Rani Rahayu" /></div>
        <div className="field"><label className="field-label">Hubungan</label><select className="text-input" value={fcRelation} onChange={(e) => setFcRelation(e.target.value)}>{['Anak', 'Pasangan', 'Cucu', 'Saudara', 'Lainnya'].map((r) => <option key={r}>{r}</option>)}</select></div>
      </div>
      <div className="field"><label className="field-label">Nomor telepon</label><input className="text-input" value={fcPhone} onChange={(e) => setFcPhone(e.target.value)} placeholder="0812-xxxx-xxxx" /></div>
      <div className="field"><label className="field-label">Rencana pendampingan (satu per baris)</label><textarea className="note-input" value={carePlanText} onChange={(e) => setCarePlanText(e.target.value)} placeholder={'Pantau kondisi harian\nDampingi aktivitas ringan'} /></div>
      <div className="button-row"><button className="btn secondary" onClick={onClose}>Batal</button><button className="btn primary" onClick={submit} disabled={!name.trim()}><Check size={16} /> {editing ? 'Simpan perubahan' : 'Tambah klien'}</button></div>
    </div></div>
  )
}

function VisitFormModal({ visit, clients, caregivers, onClose, onSave }) {
  const editing = Boolean(visit)
  const [clientName, setClientName] = useState(visit?.client || clients[0]?.name || '')
  const [caregiverName, setCaregiverName] = useState(visit?.caregiver || caregivers[0]?.name || '')
  const [time, setTime] = useState(visit?.time || '09.00 – 11.00')
  const [type, setType] = useState(visit?.type || 'Pendampingan harian')
  const submit = () => {
    if (!clientName.trim() || !caregiverName.trim()) return
    const client = clients.find((c) => c.name === clientName)
    onSave({
      id: visit?.id || uid(),
      client: clientName, clientId: client?.id || '',
      initials: initialsOf(clientName), caregiver: caregiverName,
      time, type,
      status: visit?.status || 'scheduled',
      location: visit?.location || client?.city || '—',
      checklist: visit?.checklist || [],
    })
  }
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">{editing ? 'Edit' : 'Jadwalkan'} kunjungan</p><h2>{editing ? visit.client : 'Kunjungan baru'}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="field"><label className="field-label">Klien</label><select className="text-input" value={clientName} onChange={(e) => setClientName(e.target.value)}>{clients.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
      <div className="field"><label className="field-label">Caregiver</label><select className="text-input" value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)}>{caregivers.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Waktu</label><input className="text-input" value={time} onChange={(e) => setTime(e.target.value)} placeholder="08.00 – 10.00" /></div>
        <div className="field"><label className="field-label">Jenis layanan</label><input className="text-input" value={type} onChange={(e) => setType(e.target.value)} placeholder="Pendampingan harian" /></div>
      </div>
      <div className="button-row"><button className="btn secondary" onClick={onClose}>Batal</button><button className="btn primary" onClick={submit} disabled={!clientName.trim() || !caregiverName.trim()}><Check size={16} /> {editing ? 'Simpan perubahan' : 'Jadwalkan'}</button></div>
    </div></div>
  )
}

function IncidentFormModal({ clients, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState(clients[0]?.name || '')
  const [category, setCategory] = useState('Dokumentasi')
  const [severity, setSeverity] = useState('sedang')
  const [detail, setDetail] = useState('')
  const submit = () => {
    if (!title.trim()) return
    onSave({ id: uid(), title: title.trim(), client: clientName, category, severity, status: 'open', detail: detail.trim() || '—', time: 'Baru saja' })
  }
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">Catat insiden</p><h2>Insiden baru</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="field"><label className="field-label">Judul insiden</label><input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Catatan kunjungan belum lengkap" /></div>
      <div className="form-grid">
        <div className="field"><label className="field-label">Klien</label><select className="text-input" value={clientName} onChange={(e) => setClientName(e.target.value)}>{clients.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
        <div className="field"><label className="field-label">Kategori</label><select className="text-input" value={category} onChange={(e) => setCategory(e.target.value)}>{['Dokumentasi', 'Penugasan', 'Jadwal', 'Komunikasi', 'Lainnya'].map((c) => <option key={c}>{c}</option>)}</select></div>
      </div>
      <div className="field"><label className="field-label">Tingkat keparahan</label><div className="seg-group">{['rendah', 'sedang', 'tinggi'].map((s) => <button key={s} className={`seg ${severity === s ? 'active' : ''}`} onClick={() => setSeverity(s)}>{s === 'rendah' ? 'Rendah' : s === 'sedang' ? 'Sedang' : 'Tinggi'}</button>)}</div></div>
      <div className="field"><label className="field-label">Detail</label><textarea className="note-input" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Jelaskan detail insiden..." /></div>
      <div className="button-row"><button className="btn secondary" onClick={onClose}>Batal</button><button className="btn primary" onClick={submit} disabled={!title.trim()}><Check size={16} /> Catat insiden</button></div>
    </div></div>
  )
}

function VisitModal({ visit, onClose, onCheckIn, onComplete, onToggleChecklist, onSave, onDelete }) {
  const raw = visit.note
  const existing = typeof raw === 'string' ? { text: raw } : (raw && typeof raw === 'object' ? raw : null)
  const [note, setNote] = useState(existing?.text || '')
  const [condition, setCondition] = useState(existing?.condition || 'Baik')
  const [meal, setMeal] = useState(existing?.meal || 'Cukup')
  const [mood, setMood] = useState(existing?.mood || 'baik')
  const [eliminasi, setEliminasi] = useState(existing?.eliminasi || '')
  const [sistolik, setSistolik] = useState(existing?.vitals?.sistolik || '')
  const [diastolik, setDiastolik] = useState(existing?.vitals?.diastolik || '')
  const [nadi, setNadi] = useState(existing?.vitals?.nadi || '')
  const [editing, setEditing] = useState(!existing?.text)
  const [justSaved, setJustSaved] = useState(Boolean(existing?.text))
  const saved = justSaved
  const moodObj = MOODS.find((m) => m.key === mood) || MOODS[0]
  const hasVitals = Boolean(sistolik || diastolik || nadi)
  const doneCount = (visit.checklist || []).filter((c) => c.done).length
  const total = (visit.checklist || []).length
  const saveNote = () => {
    const vitals = hasVitals ? { sistolik: Number(sistolik) || 0, diastolik: Number(diastolik) || 0, nadi: Number(nadi) || 0 } : null
    onSave({ text: note, condition, meal, mood, eliminasi, vitals }); setJustSaved(true); setEditing(false)
  }
  const completeVisit = () => { onComplete(visit); onClose() }
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">Detail kunjungan</p><h2>{visit.client}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="modal-meta"><span><Clock3 size={15} /> {visit.time}</span><span><UserRound size={15} /> {visit.caregiver}</span><span><MapPin size={14} /> {visit.location}</span></div>
      {visit.status === 'scheduled' && <div className="modal-start"><div className="modal-start-icon"><CalendarDays size={23} /></div><div><strong>Kunjungan belum dimulai</strong><p>Mulai check-in saat caregiver tiba di lokasi.</p></div><button className="btn primary" onClick={() => onCheckIn(visit)}>Mulai</button></div>}
      {visit.status !== 'scheduled' && <>
        {total > 0 && <div className="modal-checklist"><div className="modal-section-head"><ListChecks size={15} /><strong>Daftar tugas</strong><b>{doneCount}/{total}</b></div>{visit.checklist.map((c, i) => <button key={c.label} className={`check-item ${c.done ? 'done' : ''}`} onClick={() => onToggleChecklist(i)}><span className="check-box">{c.done && <Check size={12} />}</span><span>{c.label}</span></button>)}</div>}
        {saved && !editing ? (
          <div className="note-saved">
            <div className="modal-section-head"><ClipboardList size={15} /><strong>Catatan tersimpan</strong><span className="saved-badge"><Check size={12} /> Tersimpan</span></div>
            <div className="note-preview">
              <div className="preview-grid">
                <div><span>Kondisi umum</span><b>{condition}</b></div>
                <div><span>Asupan makan</span><b>{meal}</b></div>
                <div><span>Suasana hati</span><b>{moodObj.emoji} {moodObj.label}</b></div>
              </div>
              {eliminasi && <div className="preview-kv"><span>Eliminasi</span><b>{eliminasi}</b></div>}
              {hasVitals && <div className="preview-kv"><span>Tanda vital</span><b>{sistolik}/{diastolik} mmHg · {nadi} bpm</b></div>}
              {note && <p className="preview-note">{note}</p>}
            </div>
            <div className="button-row"><button className="btn secondary" onClick={() => setEditing(true)}><FileText size={16} /> Edit catatan</button>{visit.status === 'checked-in' && <button className="btn primary" onClick={completeVisit}><CheckCircle2 size={16} /> Selesaikan</button>}</div>
          </div>
        ) : (
          <>
            <div className="modal-section-head"><ClipboardList size={15} /><strong>Catatan perawatan</strong></div>
            <div className="form-grid">
              <div className="field"><label className="field-label">Kondisi umum</label><div className="seg-group">{[ 'Baik', 'Cukup', 'Perlu perhatian' ].map((c) => <button key={c} className={`seg ${condition === c ? 'active' : ''}`} onClick={() => setCondition(c)}>{c}</button>)}</div></div>
              <div className="field"><label className="field-label">Asupan makan</label><div className="seg-group">{[ 'Cukup', 'Kurang', 'Menolak' ].map((c) => <button key={c} className={`seg ${meal === c ? 'active' : ''}`} onClick={() => setMeal(c)}>{c}</button>)}</div></div>
            </div>
            <div className="field"><label className="field-label">Suasana hati</label><div className="mood-group">{MOODS.map((m) => <button key={m.key} className={`mood ${mood === m.key ? 'active' : ''}`} onClick={() => setMood(m.key)}><span>{m.emoji}</span>{m.label}</button>)}</div></div>
            <div className="field"><label className="field-label">Eliminasi / catatan lain</label><input className="text-input" value={eliminasi} onChange={(e) => setEliminasi(e.target.value)} placeholder="Contoh: buang air kecil normal, 3x" /></div>
            <div className="modal-section-head"><Activity size={15} /><strong>Tanda vital</strong><span className="opt-label">opsional</span></div>
            <div className="form-grid three">
              <div className="field"><label className="field-label">Sistolik</label><input className="text-input" type="number" value={sistolik} onChange={(e) => setSistolik(e.target.value)} placeholder="120" /></div>
              <div className="field"><label className="field-label">Diastolik</label><input className="text-input" type="number" value={diastolik} onChange={(e) => setDiastolik(e.target.value)} placeholder="80" /></div>
              <div className="field"><label className="field-label">Denyut</label><input className="text-input" type="number" value={nadi} onChange={(e) => setNadi(e.target.value)} placeholder="72" /></div>
            </div>
            <div className="field"><label className="field-label">Catatan perawatan</label><textarea className="note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tuliskan kondisi yang terlihat dan kegiatan yang dilakukan..." /></div>
            <div className="modal-guidance"><Sparkles size={15} /><span>Catatan akan dipakai untuk menyiapkan draf ringkasan pergantian shift dan update keluarga.</span></div>
            <div className="button-row"><button className="btn primary" onClick={saveNote}><Check size={16} /> Simpan catatan</button>{visit.status === 'checked-in' && <button className="btn secondary" onClick={completeVisit}><CheckCircle2 size={16} /> Selesaikan</button>}</div>
          </>
        )}
      </>}
      <button className="text-btn delete-text" onClick={onDelete}><Trash2 size={13} /> Hapus kunjungan</button>
    </div></div>
  )
}

function ClientDrawer({ client, caregivers, onClose, onEdit, onDelete }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}><div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-head"><div><p className="eyebrow">Profil klien</p><h2>{client.name}</h2><span className="drawer-sub">{client.age} tahun · {client.gender} · {client.city}</span></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="drawer-status-row"><span className={`status-pill ${client.statusTone}`}>{client.status}</span><span className="care-level">Tingkat perawatan: <b>{client.careLevel}</b></span></div>
      <div className="drawer-section"><h3>Kondisi & kebutuhan</h3><div className="drawer-chips">{client.conditions.map((c) => <span className="chip" key={c}>{c}</span>)}</div><div className="drawer-kv"><span>Alergi</span><b>{client.allergies || '—'}</b></div><div className="drawer-kv"><span>Pola makan</span><b>{client.diet || '—'}</b></div><div className="drawer-kv"><span>Mobilitas</span><b>{client.mobility || '—'}</b></div></div>
      <div className="drawer-section"><h3>Rencana pendampingan</h3><ul className="care-plan-list">{client.carePlan.map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul></div>
      <div className="drawer-section"><h3>Kontak keluarga</h3><div className="family-contact-row"><div className="avatar avatar-purple">{client.familyContact.name[0]}</div><div><strong>{client.familyContact.name}</strong><span>{client.familyContact.relation}</span></div><button className="icon-btn small"><Phone size={16} /></button></div></div>
      <div className="drawer-section"><h3>Tanda vital terakhir</h3><div className="last-vitals"><div><span>Sistolik</span><strong>{client.vitals[client.vitals.length - 1].sistolik}</strong></div><div><span>Diastolik</span><strong>{client.vitals[client.vitals.length - 1].diastolik}</strong></div><div><span>Denyut</span><strong>{client.vitals[client.vitals.length - 1].nadi} <small>bpm</small></strong></div></div></div>
      <div className="drawer-footer"><button className="btn secondary" onClick={() => onEdit(client)}><Pencil size={15} /> Edit profil</button><button className="btn danger-outline" onClick={() => onDelete(client)}><Trash2 size={15} /> Hapus</button></div>
    </div></div>
  )
}

export default App
