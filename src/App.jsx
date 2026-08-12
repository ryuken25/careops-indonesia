import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, BarChart3, Bell,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck,
  ClipboardList, Clock3, Droplets, FileText, HeartPulse, LayoutDashboard, LayoutGrid,
  ListChecks, MapPin, Menu, MessageCircle, MoreHorizontal, NotebookPen, Phone, Plus,
  Search, ShieldCheck, Smile, Sparkles, Stethoscope, TrendingUp, UserRound, UsersRound,
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

function App() {
  const [visits, setVisits] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialVisits } catch { return initialVisits }
  })
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [toast, setToast] = useState('')
  const [familyUpdate, setFamilyUpdate] = useState(INITIAL_FAMILY_UPDATE)
  const location = useLocation()
  const isCoordinator = location.pathname.startsWith('/koordinator')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(visits)) }, [visits])

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

  return (
    <div className="app-shell">
      {isCoordinator && <Sidebar />}
      <main className={`main-content ${isCoordinator ? '' : 'no-sidebar'}`}>
        <Topbar />
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/koordinator" replace />} />
            <Route path="/koordinator" element={<DashboardPage visits={visits} onOpen={setSelectedVisit} onCheckIn={(v) => setStatus(v, 'checked-in')} />} />
            <Route path="/koordinator/kunjungan" element={<VisitsPage visits={visits} onOpen={setSelectedVisit} onMove={setStatus} />} />
            <Route path="/koordinator/klien" element={<ClientsPage onOpen={setSelectedClient} />} />
            <Route path="/koordinator/caregiver" element={<CaregiversPage />} />
            <Route path="/koordinator/catatan" element={<NotesPage update={familyUpdate} generateDraft={generateDraft} approveUpdate={approveUpdate} exportReport={exportReport} />} />
            <Route path="/caregiver" element={<CaregiverPage visits={visits} onOpen={setSelectedVisit} onCheckIn={(v) => setStatus(v, 'checked-in')} onComplete={(v) => setStatus(v, 'completed')} onToggleChecklist={toggleChecklist} />} />
            <Route path="/keluarga" element={<Navigate to="/keluarga/c2" replace />} />
            <Route path="/keluarga/:clientId" element={<FamilyRoute update={familyUpdate} />} />
            <Route path="*" element={<Navigate to="/koordinator" replace />} />
          </Routes>
        </div>
      </main>
      {selectedVisit && <VisitModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} onCheckIn={() => setStatus(selectedVisit, 'checked-in')} onComplete={() => setStatus(selectedVisit, 'completed')} onToggleChecklist={(i) => toggleChecklist(selectedVisit.id, i)} onSave={(note) => { updateVisit(selectedVisit.id, { note }); notify('Catatan perawatan tersimpan.') }} />}
      {selectedClient && <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  )
}

function Sidebar() {
  const location = useLocation()
  const items = [
    { icon: LayoutDashboard, label: 'Ringkasan', to: '/koordinator' },
    { icon: CalendarDays, label: 'Kunjungan', to: '/koordinator/kunjungan', count: '4' },
    { icon: UsersRound, label: 'Klien', to: '/koordinator/klien' },
    { icon: UserRound, label: 'Caregiver', to: '/koordinator/caregiver' },
    { icon: NotebookPen, label: 'Catatan & Insiden', to: '/koordinator/catatan', count: '2' },
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
        <div className="profile-mini"><div className="avatar avatar-purple">AN</div><div><strong>Andini Nurhaliza</strong><span>Koordinator</span></div><MoreHorizontal size={18} className="muted-icon" /></div>
      </div>
    </aside>
  )
}

function Topbar() {
  const location = useLocation()
  const roles = [
    { label: 'Koordinator', to: '/koordinator' },
    { label: 'Caregiver', to: '/caregiver' },
    { label: 'Keluarga', to: '/keluarga/c2' },
  ]
  const current = location.pathname.startsWith('/koordinator') ? 'Koordinator' : location.pathname.startsWith('/caregiver') ? 'Caregiver' : 'Keluarga'
  return (
    <header className="topbar">
      <div className="mobile-brand"><Link to="/koordinator" className="brand-mark"><HeartPulse size={17} /></Link><Link to="/koordinator"><strong>careops</strong></Link></div>
      <div className="breadcrumb"><span>Ruang demo</span><ArrowRight size={14} /><strong>{current}</strong></div>
      <div className="top-actions">
        <button className="icon-btn" aria-label="Notifikasi"><Bell size={18} /><i /></button>
        <div className="role-nav">{roles.map((r) => <Link key={r.to} to={r.to} className={current === r.label ? 'active' : ''}>{r.label}</Link>)}</div>
      </div>
    </header>
  )
}

function PageHeader({ eyebrow, title, description, action, children }) { return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div><div className="header-actions">{children}{action && <button className="btn primary"><Plus size={17} /> {action}</button>}</div></div> }
function PanelTitle({ title, action, hint }) { return <div className="panel-title"><h2>{title}</h2>{hint && <span className="panel-hint">{hint}</span>}{action && <button className="text-btn">{action}<ArrowRight size={14} /></button>}</div> }
function Metric({ icon: Icon, label, value, foot, tone, delta }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19} /></div><span>{label}</span><strong>{value}</strong><small>{foot}</small>{delta && <span className={`metric-delta ${delta > 0 ? 'up' : 'down'}`}>{delta > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(delta)}%</span>}</div> }

function DashboardPage({ visits, onOpen, onCheckIn }) {
  const completed = visits.filter((v) => v.status === 'completed').length
  const ongoing = visits.filter((v) => v.status === 'checked-in').length
  const scheduled = visits.filter((v) => v.status === 'scheduled').length
  const activeVisit = visits.find((v) => v.status === 'checked-in')
  return <>
    <PageHeader eyebrow="Selasa, 18 Agustus 2026" title="Selamat pagi, Andini" description="Berikut gambaran operasional kunjungan hari ini." action="Jadwalkan kunjungan" />
    <div className="notice"><div className="notice-symbol"><ShieldCheck size={18} /></div><div><strong>Ruang demo CareOps Indonesia</strong><span>Gunakan navigasi peran di kanan atas untuk melihat sisi coordinator, caregiver, dan keluarga.</span></div><button aria-label="Tutup"><X size={16} /></button></div>
    <div className="metrics-grid">
      <Metric icon={CalendarDays} label="Kunjungan hari ini" value={String(visits.length)} foot={`${completed} selesai · ${ongoing} berlangsung · ${scheduled} terjadwal`} tone="blue" delta={8} />
      <Metric icon={CheckCircle2} label="Tingkat penyelesaian" value={`${Math.round((completed / Math.max(1, visits.length)) * 100)}%`} foot="Dari seluruh kunjungan" tone="green" delta={4} />
      <Metric icon={AlertTriangle} label="Perlu ditinjau" value="2" foot="1 catatan · 1 penugasan" tone="amber" />
      <Metric icon={Clock3} label="Kelengkapan catatan" value="86%" foot="Naik 8% dari kemarin" tone="purple" delta={8} />
    </div>
    <div className="content-grid two-thirds">
      <section className="panel"><PanelTitle title="Tren kunjungan" hint="7 hari terakhir" action="Minggu ini" /><TrendChart data={weeklyTrend} /><div className="trend-legend"><span><i style={{ background: '#3666f6' }} />Kunjungan</span><span><i style={{ background: '#50b89c' }} />Selesai</span></div></section>
      <section className="panel"><PanelTitle title="Status kunjungan" hint="7 hari terakhir" /><StatusDonut data={statusDistribution} /><div className="donut-legend">{statusDistribution.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}<b>{s.value}</b></span>)}</div></section>
    </div>
    <div className="content-grid two-thirds bottom-grid">
      <section className="panel schedule-panel"><PanelTitle title="Jadwal hari ini" action="Lihat semua" /><div className="schedule-list">{visits.map((visit) => <VisitRow key={visit.id} visit={visit} onOpen={onOpen} onCheckIn={onCheckIn} />)}</div></section>
      <section className="panel"><PanelTitle title="Beban caregiver" hint="Minggu ini" /><LoadBar data={caregiverLoad} /></section>
    </div>
    <div className="content-grid two-thirds bottom-grid">
      <section className="panel"><PanelTitle title="Perlu perhatian" action="Semua catatan" /><div className="incident-list">{incidentSeed.slice(0, 3).map((item) => <Incident key={item.id} {...item} />)}</div></section>
      <section className="panel care-quality"><PanelTitle title="Kualitas pendampingan" action="Minggu ini" /><div className="quality-score"><div className="score-ring"><strong>94</strong><span>/100</span></div><div><strong className="score-label">Baik sekali</strong><p>Indikator operasional stabil. Ada ruang perbaikan pada kelengkapan catatan kunjungan pagi.</p></div></div><div className="progress-row"><span>Kunjungan tepat waktu</span><strong>96%</strong><div className="progress"><i style={{ width: '96%' }} /></div></div><div className="progress-row"><span>Catatan lengkap</span><strong>86%</strong><div className="progress"><i style={{ width: '86%' }} /></div></div><div className="progress-row"><span>Kepuasan keluarga</span><strong>4.8</strong><div className="progress"><i style={{ width: '96%' }} /></div></div></section>
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

function Incident({ title, detail, time, severity }) {
  const tone = { tinggi: 'red', sedang: 'amber', rendah: 'blue', resolved: 'green' }[severity] || 'blue'
  const label = { tinggi: 'Tinggi', sedang: 'Sedang', rendah: 'Rendah' }[severity] || severity
  return <div className="incident"><div className={`incident-icon ${tone}`}><AlertTriangle size={17} /></div><div><strong>{title}</strong><span>{detail}</span><small>{time}</small></div><span className={`sev-pill ${tone}`}>{label}</span></div>
}

function ClientsPage({ onOpen }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const filtered = clientSeed.filter((c) => `${c.name} ${c.city} ${c.careType}`.toLowerCase().includes(search.toLowerCase())).filter((c) => filter === 'Semua' ? true : filter === 'Perlu perhatian' ? c.statusTone === 'amber' : c.statusTone === 'green')
  return <>
    <PageHeader eyebrow="Data klien" title="Klien" description="Daftar klien beserta rencana dan status pendampingan." action="Tambah klien" />
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

function CaregiversPage() {
  return <>
    <PageHeader eyebrow="Tim pendamping" title="Caregiver" description="Pantau penugasan, beban kerja, dan ketersediaan tim." action="Tambah caregiver" />
    <div className="caregiver-grid">{caregiverSeed.map((person) => {
      const load = caregiverLoad.find((l) => l.name === person.name.split(' ')[0])
      return (
        <div className="caregiver-card" key={person.id}>
          <div className="caregiver-top"><div className={`avatar avatar-${person.color}`}>{person.initials}</div><span className={`status-pill ${person.tone}`}>{person.status}</span></div>
          <h3>{person.name}</h3><p>{person.role} · {person.specialty}</p>
          <div className="rating-row"><span className="stars">★★★★★</span><strong>{person.rating}</strong></div>
          <div className="caregiver-stat"><span>Kunjungan hari ini</span><strong>{person.visitsToday}</strong></div>
          <div className="caregiver-stat"><span>Selesai</span><strong>{person.completedToday}</strong></div>
          <div className="caregiver-stat"><span>Beban minggu ini</span><strong>{load ? load.kunjungan : 0} kunjungan</strong></div>
          <button className="outline-btn">Lihat profil <ArrowRight size={14} /></button>
        </div>
      )
    })}</div>
  </>
}

function VisitsPage({ visits, onOpen, onMove }) {
  const columns = [
    { key: 'scheduled', label: 'Terjadwal', tone: 'slate' },
    { key: 'checked-in', label: 'Berlangsung', tone: 'blue' },
    { key: 'completed', label: 'Selesai', tone: 'green' },
  ]
  return <>
    <PageHeader eyebrow="Operasional" title="Kunjungan" description="Atur dan pantau status kunjungan dalam satu papan kerja." action="Jadwalkan kunjungan" />
    <div className="kanban-board">
      {columns.map((col) => (
        <div className="kanban-col" key={col.key}>
          <div className="kanban-head"><span className={`kanban-dot ${col.tone}`} />{col.label}<b>{visits.filter((v) => v.status === col.key).length}</b></div>
          <div className="kanban-cards">
            {visits.filter((v) => v.status === col.key).map((v) => (
              <div className="kanban-card" key={v.id}>
                <div className="kanban-card-top"><span className="kanban-time"><Clock3 size={13} /> {v.time}</span><MoreHorizontal size={16} className="muted-icon" onClick={() => onOpen(v)} /></div>
                <div className="kanban-client"><div className={`avatar avatar-${col.tone === 'green' ? 'green' : col.tone === 'blue' ? 'blue' : 'purple'} small`}>{v.initials}</div><div><strong>{v.client}</strong><span>{v.type}</span></div></div>
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

function NotesPage({ update, generateDraft, approveUpdate, exportReport }) {
  return <>
    <PageHeader eyebrow="Catatan & komunikasi" title="Catatan perawatan" description="Tinjau catatan caregiver, kelola insiden, dan siapkan update keluarga."><button className="btn secondary" onClick={exportReport}><FileText size={16} /> Unduh laporan</button></PageHeader>
    <div className="content-grid notes-grid">
      <section className="panel">
        <PanelTitle title="Catatan terbaru" action="Filter" />
        <div className="note-card">
          <div className="note-card-header"><div className="avatar avatar-blue">RM</div><div><strong>Rina Maharani</strong><span>Hari ini, 11.58 · Bapak Hendra Wijaya</span></div><span className="status-pill blue">Ditinjau</span></div>
          <p>Bapak Hendra tampak lebih bugar pagi ini. Nafsu makan baik dan sudah menyelesaikan latihan gerak ringan.</p>
          <div className="note-tags"><span><Check size={13} /> Aktivitas tercatat</span><span><Check size={13} /> Kondisi umum</span><span><Check size={13} /> Asupan makan</span></div>
        </div>
        <div className="note-card incomplete">
          <div className="note-card-header"><div className="avatar avatar-purple">DL</div><div><strong>Dewi Lestari</strong><span>Hari ini, 10.12 · Ibu Sari Wulandari</span></div><span className="status-pill amber">Belum lengkap</span></div>
          <p>Catatan kunjungan belum dikirim. Lengkapi sebelum pergantian shift sore.</p>
          <button className="text-btn">Lengkapi catatan <ArrowRight size={14} /></button>
        </div>
        <div className="incident-divider" />
        <PanelTitle title="Insiden & tindak lanjut" />
        <div className="incident-list">{incidentSeed.map((item) => <Incident key={item.id} {...item} />)}</div>
      </section>
      <section className="panel update-panel">
        <PanelTitle title="Update untuk keluarga" action="Bantuan" />
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

function CaregiverPage({ visits, onOpen, onCheckIn, onComplete, onToggleChecklist }) {
  const own = visits.filter((v) => v.caregiver === 'Dewi Lestari')
  const done = own.filter((v) => v.status === 'completed').length
  const progress = own.length ? Math.round((done / own.length) * 100) : 0
  return <div className="caregiver-view">
    <div className="caregiver-greeting"><p className="eyebrow">Selasa, 18 Agustus 2026</p><h1>Selamat pagi, Dewi</h1><p>Siap mendampingi {own.length} kunjungan hari ini?</p></div>
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
    <div className="mobile-safety"><ShieldCheck size={18} /><div><strong>Pengingat pendampingan</strong><span>Catat kondisi yang terlihat dan kegiatan yang dilakukan. Jangan memasukkan diagnosis atau saran obat.</span></div></div>
  </div>
}

function FamilyRoute({ update }) {
  const { clientId } = useParams()
  const client = clientSeed.find((c) => c.id === clientId) || clientSeed[1]
  return <FamilyPage update={update} client={client} />
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

function VisitModal({ visit, onClose, onCheckIn, onComplete, onToggleChecklist, onSave }) {
  const [note, setNote] = useState(visit.note || '')
  const [condition, setCondition] = useState('Baik')
  const [meal, setMeal] = useState('Cukup')
  const [mood, setMood] = useState('baik')
  const [eliminasi, setEliminasi] = useState('')
  const saved = Boolean(visit.note)
  const doneCount = (visit.checklist || []).filter((c) => c.done).length
  const total = (visit.checklist || []).length
  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">Detail kunjungan</p><h2>{visit.client}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="modal-meta"><span><Clock3 size={15} /> {visit.time}</span><span><UserRound size={15} /> {visit.caregiver}</span><span><MapPin size={14} /> {visit.location}</span></div>
      {visit.status === 'scheduled' && <div className="modal-start"><div className="modal-start-icon"><CalendarDays size={23} /></div><div><strong>Kunjungan belum dimulai</strong><p>Mulai check-in saat caregiver tiba di lokasi.</p></div><button className="btn primary" onClick={() => onCheckIn(visit)}>Mulai</button></div>}
      {visit.status !== 'scheduled' && <>
        {total > 0 && <div className="modal-checklist"><div className="modal-section-head"><ListChecks size={15} /><strong>Daftar tugas</strong><b>{doneCount}/{total}</b></div>{visit.checklist.map((c, i) => <button key={c.label} className={`check-item ${c.done ? 'done' : ''}`} onClick={() => onToggleChecklist(i)}><span className="check-box">{c.done && <Check size={12} />}</span><span>{c.label}</span></button>)}</div>}
        <div className="modal-section-head"><ClipboardList size={15} /><strong>Catatan perawatan</strong></div>
        <div className="form-grid">
          <div className="field"><label className="field-label">Kondisi umum</label><div className="seg-group">{[ 'Baik', 'Cukup', 'Perlu perhatian' ].map((c) => <button key={c} className={`seg ${condition === c ? 'active' : ''}`} onClick={() => setCondition(c)}>{c}</button>)}</div></div>
          <div className="field"><label className="field-label">Asupan makan</label><div className="seg-group">{[ 'Cukup', 'Kurang', 'Menolak' ].map((c) => <button key={c} className={`seg ${meal === c ? 'active' : ''}`} onClick={() => setMeal(c)}>{c}</button>)}</div></div>
        </div>
        <div className="field"><label className="field-label">Suasana hati</label><div className="mood-group">{MOODS.map((m) => <button key={m.key} className={`mood ${mood === m.key ? 'active' : ''}`} onClick={() => setMood(m.key)}><span>{m.emoji}</span>{m.label}</button>)}</div></div>
        <div className="field"><label className="field-label">Eliminasi / catatan lain</label><input className="text-input" value={eliminasi} onChange={(e) => setEliminasi(e.target.value)} placeholder="Contoh: buang air kecil normal, 3x" /></div>
        <div className="field"><label className="field-label">Catatan perawatan</label><textarea className="note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tuliskan kondisi yang terlihat dan kegiatan yang dilakukan..." /></div>
        <div className="modal-guidance"><Sparkles size={15} /><span>Catatan akan dipakai untuk menyiapkan draf ringkasan pergantian shift dan update keluarga.</span></div>
        <div className="button-row"><button className="btn secondary" onClick={() => { onSave(note); onClose() }}><Check size={16} /> {saved ? 'Catatan tersimpan' : 'Simpan catatan'}</button>{visit.status === 'checked-in' && <button className="btn primary" onClick={() => onComplete(visit)}><CheckCircle2 size={16} /> Selesaikan</button>}</div>
      </>}
    </div></div>
  )
}

function ClientDrawer({ client, onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}><div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-head"><div><p className="eyebrow">Profil klien</p><h2>{client.name}</h2><span className="drawer-sub">{client.age} tahun · {client.gender} · {client.city}</span></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="drawer-status-row"><span className={`status-pill ${client.statusTone}`}>{client.status}</span><span className="care-level">Tingkat perawatan: <b>{client.careLevel}</b></span></div>
      <div className="drawer-section"><h3>Kondisi & kebutuhan</h3><div className="drawer-chips">{client.conditions.map((c) => <span className="chip" key={c}>{c}</span>)}</div><div className="drawer-kv"><span>Alergi</span><b>{client.allergies}</b></div><div className="drawer-kv"><span>Pola makan</span><b>{client.diet}</b></div><div className="drawer-kv"><span>Mobilitas</span><b>{client.mobility}</b></div></div>
      <div className="drawer-section"><h3>Rencana pendampingan</h3><ul className="care-plan-list">{client.carePlan.map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul></div>
      <div className="drawer-section"><h3>Kontak keluarga</h3><div className="family-contact-row"><div className="avatar avatar-purple">{client.familyContact.name[0]}</div><div><strong>{client.familyContact.name}</strong><span>{client.familyContact.relation}</span></div><button className="icon-btn small"><Phone size={16} /></button></div></div>
      <div className="drawer-section"><h3>Tanda vital terakhir</h3><div className="last-vitals"><div><span>Sistolik</span><strong>{client.vitals[client.vitals.length - 1].sistolik}</strong></div><div><span>Diastolik</span><strong>{client.vitals[client.vitals.length - 1].diastolik}</strong></div><div><span>Denyut</span><strong>{client.vitals[client.vitals.length - 1].nadi} <small>bpm</small></strong></div></div></div>
      <div className="drawer-footer"><button className="btn secondary">Edit profil</button><button className="btn primary">Lihat jadwal</button></div>
    </div></div>
  )
}

export default App
