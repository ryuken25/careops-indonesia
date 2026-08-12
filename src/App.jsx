import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowRight, Baby, Bell, CalendarDays, Check,
  CheckCircle2, ChevronDown, ClipboardCheck, Clock3, FileText, HeartPulse,
  LayoutDashboard, Menu, MessageCircle, MoreHorizontal, Plus, Search,
  ShieldCheck, Sparkles, Stethoscope, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import './styles.css'

const initialVisits = [
  { id: 1, client: 'Ibu Sari Wulandari', initials: 'SW', age: '72 tahun', caregiver: 'Dewi Lestari', time: '08.00 – 10.00', type: 'Perawatan pagi', status: 'scheduled', location: 'Kebayoran Baru', note: '' },
  { id: 2, client: 'Bapak Hendra Wijaya', initials: 'HW', age: '68 tahun', caregiver: 'Rina Maharani', time: '10.30 – 12.00', type: 'Pendampingan aktivitas', status: 'checked-in', location: 'Cilandak', note: 'Bapak Hendra tampak lebih bugar pagi ini. Nafsu makan baik dan sudah menyelesaikan latihan gerak ringan.' },
  { id: 3, client: 'Ibu Ratna Kusuma', initials: 'RK', age: '79 tahun', caregiver: 'Siti Aminah', time: '13.00 – 15.00', type: 'Pendampingan siang', status: 'scheduled', location: 'Pondok Indah', note: '' },
  { id: 4, client: 'Bapak Agus Santoso', initials: 'AS', age: '70 tahun', caregiver: 'Dewi Lestari', time: '16.00 – 18.00', type: 'Pendampingan sore', status: 'completed', location: 'Tebet', note: 'Kegiatan sore berjalan sesuai rencana. Tidak ada keluhan baru yang dicatat.' },
]

const clients = [
  { name: 'Ibu Sari Wulandari', initials: 'SW', age: 72, city: 'Kebayoran Baru', care: 'Pendampingan harian', status: 'Stabil', statusTone: 'green', next: 'Hari ini, 08.00', caregiver: 'Dewi Lestari' },
  { name: 'Bapak Hendra Wijaya', initials: 'HW', age: 68, city: 'Cilandak', care: 'Pemulihan mobilitas', status: 'Perlu perhatian', statusTone: 'amber', next: 'Sedang berlangsung', caregiver: 'Rina Maharani' },
  { name: 'Ibu Ratna Kusuma', initials: 'RK', age: 79, city: 'Pondok Indah', care: 'Pendampingan siang', status: 'Stabil', statusTone: 'green', next: 'Hari ini, 13.00', caregiver: 'Siti Aminah' },
  { name: 'Bapak Agus Santoso', initials: 'AS', age: 70, city: 'Tebet', care: 'Pendampingan harian', status: 'Stabil', statusTone: 'green', next: 'Selesai hari ini', caregiver: 'Dewi Lestari' },
]

const caregivers = [
  { name: 'Dewi Lestari', initials: 'DL', role: 'Caregiver senior', visits: 2, status: 'Bertugas', tone: 'green', color: 'purple' },
  { name: 'Rina Maharani', initials: 'RM', role: 'Caregiver', visits: 1, status: 'Sedang kunjungan', tone: 'blue', color: 'blue' },
  { name: 'Siti Aminah', initials: 'SA', role: 'Caregiver', visits: 1, status: 'Bertugas', tone: 'green', color: 'orange' },
  { name: 'Maya Pratiwi', initials: 'MP', role: 'Caregiver pengganti', visits: 0, status: 'Siap ditugaskan', tone: 'slate', color: 'pink' },
]

const incidents = [
  { title: 'Catatan belum lengkap', detail: 'Kunjungan Ibu Sari pukul 08.00 belum memiliki catatan perawatan.', time: '15 menit lalu', tone: 'amber', icon: ClipboardCheck },
  { title: 'Pergantian caregiver', detail: 'Dewi Lestari meminta penggantian untuk kunjungan sore.', time: '1 jam lalu', tone: 'blue', icon: UsersRound },
  { title: 'Laporan ditinjau', detail: 'Update keluarga Bapak Hendra telah disetujui.', time: '2 jam lalu', tone: 'green', icon: CheckCircle2 },
]

function App() {
  const [role, setRole] = useState('Koordinator')
  const [active, setActive] = useState('Ringkasan')
  const [visits, setVisits] = useState(initialVisits)
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [familyUpdate, setFamilyUpdate] = useState({ status: 'draft', text: 'Bapak Hendra tampak lebih bugar pagi ini. Nafsu makan baik dan sudah menyelesaikan latihan gerak ringan.' })

  const filteredClients = useMemo(() => clients.filter((client) => `${client.name} ${client.city} ${client.care}`.toLowerCase().includes(search.toLowerCase())), [search])
  const activeVisit = visits.find((v) => v.status === 'checked-in') || visits[1]

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }

  const updateVisit = (id, patch) => {
    setVisits((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  const handleCheckIn = (visit) => {
    updateVisit(visit.id, { status: 'checked-in' })
    setSelectedVisit({ ...visit, status: 'checked-in' })
    notify(`Kunjungan ${visit.client} dimulai.`)
  }

  const handleComplete = (visit) => {
    updateVisit(visit.id, { status: 'completed' })
    setSelectedVisit(null)
    notify(`Kunjungan ${visit.client} ditandai selesai.`)
  }

  const generateDraft = () => {
    setFamilyUpdate({ status: 'draft', text: 'Bapak Hendra menjalani aktivitas pagi dengan baik. Ia mengikuti latihan gerak ringan dan makan dengan cukup. Tidak ada keluhan baru yang dicatat selama kunjungan.' })
    notify('Draf update keluarga berhasil dibuat. Silakan tinjau sebelum disetujui.')
  }

  const approveUpdate = () => {
    setFamilyUpdate((item) => ({ ...item, status: 'approved' }))
    notify('Update keluarga sudah disetujui dan tampil di halaman keluarga.')
  }

  const renderPage = () => {
    if (role === 'Caregiver') return <CaregiverPage visits={visits} onCheckIn={handleCheckIn} onComplete={handleComplete} onOpen={(v) => setSelectedVisit(v)} />
    if (role === 'Keluarga') return <FamilyPage update={familyUpdate} client={activeVisit} />
    if (active === 'Klien') return <ClientsPage clients={filteredClients} search={search} setSearch={setSearch} />
    if (active === 'Caregiver') return <CaregiversPage />
    if (active === 'Kunjungan') return <VisitsPage visits={visits} onOpen={setSelectedVisit} />
    if (active === 'Catatan & Insiden') return <NotesPage update={familyUpdate} generateDraft={generateDraft} approveUpdate={approveUpdate} />
    return <DashboardPage visits={visits} clients={clients} incidents={incidents} onOpen={setSelectedVisit} onCheckIn={handleCheckIn} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><HeartPulse size={19} /></div><div><strong>careops</strong><span>INDONESIA</span></div></div>
        <div className="demo-badge"><span className="pulse-dot" /> Ruang demo</div>
        <nav className="nav-list">
          <p className="nav-label">Workspace</p>
          <NavItem icon={LayoutDashboard} label="Ringkasan" active={active === 'Ringkasan'} onClick={() => setActive('Ringkasan')} />
          <NavItem icon={CalendarDays} label="Kunjungan" active={active === 'Kunjungan'} onClick={() => setActive('Kunjungan')} count="4" />
          <NavItem icon={UsersRound} label="Klien" active={active === 'Klien'} onClick={() => setActive('Klien')} />
          <NavItem icon={UserRound} label="Caregiver" active={active === 'Caregiver'} onClick={() => setActive('Caregiver')} />
          <p className="nav-label section-gap">Catatan</p>
          <NavItem icon={FileText} label="Catatan & Insiden" active={active === 'Catatan & Insiden'} onClick={() => setActive('Catatan & Insiden')} count="2" />
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><ShieldCheck size={18} /></div><div><strong>Data simulasi</strong><p>Ruang ini menggunakan data contoh, bukan data pasien nyata.</p></div></div><div className="profile-mini"><div className="avatar avatar-purple">AN</div><div><strong>Andini Nurhaliza</strong><span>Koordinator</span></div><MoreHorizontal size={18} className="muted-icon" /></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="mobile-brand"><Menu size={21} /><div className="brand-mark"><HeartPulse size={17} /></div><strong>careops</strong></div><div className="breadcrumb"><span>Ruang demo</span><ArrowRight size={14} /><strong>{role === 'Caregiver' ? 'Tampilan caregiver' : role === 'Keluarga' ? 'Update keluarga' : active}</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifikasi"><Bell size={18} /><i /></button><div className="role-switch"><span>Lihat sebagai</span><select value={role} onChange={(e) => { setRole(e.target.value); setActive('Ringkasan') }}><option>Koordinator</option><option>Caregiver</option><option>Keluarga</option></select><ChevronDown size={14} /></div></div></header>
        <div className="page-wrap">{renderPage()}</div>
      </main>
      {selectedVisit && <VisitModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} onCheckIn={handleCheckIn} onComplete={handleComplete} onSave={(note) => { updateVisit(selectedVisit.id, { note }); notify('Catatan perawatan tersimpan.'); }} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  )
}

function NavItem({ icon: Icon, label, active, onClick, count }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon size={18} /><span>{label}</span>{count && <b>{count}</b>}</button> }

function PageHeader({ eyebrow, title, description, action, children }) { return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div><div className="header-actions">{children}{action && <button className="btn primary"><Plus size={17} /> {action}</button>}</div></div> }

function DashboardPage({ visits, clients, incidents, onOpen, onCheckIn }) {
  const completed = visits.filter((v) => v.status === 'completed').length
  const activeVisit = visits.find((v) => v.status === 'checked-in')
  return <>
    <PageHeader eyebrow="Selasa, 18 Agustus 2026" title="Selamat pagi, Andini" description="Berikut kondisi operasional kunjungan hari ini." action="Jadwalkan kunjungan" />
    <div className="notice"><div className="notice-symbol"><ShieldCheck size={18} /></div><div><strong>Ruang demo CareOps Indonesia</strong><span>Gunakan pergantian peran di kanan atas untuk mencoba alur coordinator, caregiver, dan keluarga.</span></div><button aria-label="Tutup"><X size={16} /></button></div>
    <div className="metrics-grid"><Metric icon={CalendarDays} label="Kunjungan hari ini" value="4" foot="2 selesai · 1 berlangsung" tone="blue" /><Metric icon={CheckCircle2} label="Kunjungan selesai" value={completed.toString()} foot="Dari 4 kunjungan hari ini" tone="green" /><Metric icon={AlertTriangle} label="Perlu ditinjau" value="2" foot="1 catatan · 1 pergantian" tone="amber" /><Metric icon={Clock3} label="Kelengkapan catatan" value="86%" foot="Naik 8% dari kemarin" tone="purple" /> </div>
    <div className="content-grid two-thirds"><section className="panel schedule-panel"><PanelTitle title="Jadwal hari ini" action="Lihat semua" /><div className="schedule-list">{visits.map((visit) => <VisitRow key={visit.id} visit={visit} onOpen={onOpen} onCheckIn={onCheckIn} />)}</div></section><section className="panel"><PanelTitle title="Perlu perhatian" action="Semua catatan" /><div className="incident-list">{incidents.map((item, idx) => <Incident key={idx} {...item} />)}</div></section></div>
    <div className="content-grid two-thirds bottom-grid"><section className="panel"><PanelTitle title="Klien aktif" action="Lihat semua" /><div className="client-table">{clients.slice(0, 4).map((client) => <div className="client-row" key={client.name}><div className={`avatar avatar-${client.statusTone}`}>{client.initials}</div><div className="client-main"><strong>{client.name}</strong><span>{client.age} tahun · {client.city}</span></div><div className="client-care"><span>{client.care}</span><small>{client.next}</small></div><span className={`status-pill ${client.statusTone}`}>{client.status}</span></div>)}</div></section><section className="panel care-quality"><PanelTitle title="Kualitas pendampingan" action="Minggu ini" /><div className="quality-score"><div className="score-ring"><strong>94</strong><span>/100</span></div><div><strong className="score-label">Baik sekali</strong><p>Indikator operasional stabil. Ada ruang perbaikan pada kelengkapan catatan kunjungan pagi.</p></div></div><div className="progress-row"><span>Kunjungan tepat waktu</span><strong>96%</strong><div className="progress"><i style={{ width: '96%' }} /></div></div><div className="progress-row"><span>Catatan lengkap</span><strong>86%</strong><div className="progress"><i style={{ width: '86%' }} /></div></div></section></div>
    {activeVisit && <div className="flow-hint"><div className="flow-icon"><Sparkles size={19} /></div><div><strong>Alur contoh sedang berlangsung</strong><span>{activeVisit.caregiver} sedang mencatat kunjungan {activeVisit.client}. Buka menu <b>Catatan & Insiden</b> untuk meninjau draf update keluarga.</span></div><ArrowRight size={18} /></div>}
  </>
}

function Metric({ icon: Icon, label, value, foot, tone }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19} /></div><span>{label}</span><strong>{value}</strong><small>{foot}</small></div> }
function PanelTitle({ title, action }) { return <div className="panel-title"><h2>{title}</h2>{action && <button className="text-btn">{action}<ArrowRight size={14} /></button>}</div> }
function VisitRow({ visit, onOpen, onCheckIn }) { const status = { scheduled: ['Terjadwal', 'slate'], 'checked-in': ['Berlangsung', 'blue'], completed: ['Selesai', 'green'] }[visit.status]; return <button className="visit-row" onClick={() => onOpen(visit)}><div className="visit-time"><strong>{visit.time.split(' – ')[0]}</strong><span>{visit.time.split(' – ')[1]}</span></div><div className={`visit-line ${visit.status}`} /><div className={`avatar avatar-${visit.status === 'completed' ? 'green' : visit.status === 'checked-in' ? 'blue' : 'purple'}`}>{visit.initials}</div><div className="visit-info"><strong>{visit.client}</strong><span>{visit.type} · {visit.caregiver}</span><small><span className="location-dot" /> {visit.location}</small></div><span className={`status-pill ${status[1]}`}>{status[0]}</span>{visit.status === 'scheduled' && <span className="quick-action" onClick={(e) => { e.stopPropagation(); onCheckIn(visit) }}>Mulai</span>}</button> }
function Incident({ title, detail, time, tone, icon: Icon }) { return <div className="incident"><div className={`incident-icon ${tone}`}><Icon size={17} /></div><div><strong>{title}</strong><span>{detail}</span><small>{time}</small></div><ArrowRight size={15} className="muted-icon" /></div> }

function ClientsPage({ clients, search, setSearch }) { return <><PageHeader eyebrow="Data klien" title="Klien" description="Daftar klien dan informasi pendampingan yang sedang berjalan." action="Tambah klien" /><div className="toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, lokasi, atau layanan..." /></div><button className="filter-btn">Semua status <ChevronDown size={15} /></button></div><div className="client-cards">{clients.map((client) => <div className="client-card" key={client.name}><div className="client-card-top"><div className={`avatar avatar-${client.statusTone}`}>{client.initials}</div><span className={`status-pill ${client.statusTone}`}>{client.status}</span><MoreHorizontal size={18} className="muted-icon" /></div><h3>{client.name}</h3><p>{client.age} tahun · {client.city}</p><div className="client-card-detail"><span>Layanan</span><strong>{client.care}</strong></div><div className="client-card-detail"><span>Caregiver</span><strong>{client.caregiver}</strong></div><div className="client-card-footer"><span>Kunjungan berikutnya</span><strong>{client.next}</strong></div></div>)}</div></> }
function CaregiversPage() { return <><PageHeader eyebrow="Tim pendamping" title="Caregiver" description="Pantau penugasan dan ketersediaan tim pendamping." action="Tambah caregiver" /><div className="caregiver-grid">{caregivers.map((person) => <div className="caregiver-card" key={person.name}><div className="caregiver-top"><div className={`avatar avatar-${person.color}`}>{person.initials}</div><span className={`status-pill ${person.tone}`}>{person.status}</span></div><h3>{person.name}</h3><p>{person.role}</p><div className="caregiver-stat"><span>Kunjungan hari ini</span><strong>{person.visits}</strong></div><button className="outline-btn">Lihat profil <ArrowRight size={14} /></button></div>)}</div></> }
function VisitsPage({ visits, onOpen }) { return <><PageHeader eyebrow="Operasional" title="Kunjungan" description="Jadwal dan status kunjungan caregiver." action="Jadwalkan kunjungan" /><div className="tabs"><button className="tab active">Hari ini <b>4</b></button><button className="tab">Minggu ini</button><button className="tab">Kalender</button></div><div className="panel full-panel"><div className="visit-table-head"><span>Waktu</span><span>Klien</span><span>Caregiver</span><span>Status</span><span /></div>{visits.map((visit) => <div className="visit-table-row" key={visit.id}><strong>{visit.time}</strong><div className="table-person"><div className="avatar avatar-purple small">{visit.initials}</div><span><strong>{visit.client}</strong><small>{visit.type}</small></span></div><span>{visit.caregiver}</span><span className={`status-pill ${visit.status === 'completed' ? 'green' : visit.status === 'checked-in' ? 'blue' : 'slate'}`}>{visit.status === 'completed' ? 'Selesai' : visit.status === 'checked-in' ? 'Berlangsung' : 'Terjadwal'}</span><button className="more-btn" onClick={() => onOpen(visit)}><MoreHorizontal size={17} /></button></div>)}</div></> }
function NotesPage({ update, generateDraft, approveUpdate }) { return <><PageHeader eyebrow="Catatan & komunikasi" title="Catatan perawatan" description="Tinjau catatan caregiver dan siapkan update untuk keluarga." /><div className="content-grid notes-grid"><section className="panel"><PanelTitle title="Catatan terbaru" action="Filter" /><div className="note-card"><div className="note-card-header"><div className="avatar avatar-blue">RM</div><div><strong>Rina Maharani</strong><span>Hari ini, 11.58 · Bapak Hendra Wijaya</span></div><span className="status-pill blue">Ditinjau</span></div><p>Bapak Hendra tampak lebih bugar pagi ini. Nafsu makan baik dan sudah menyelesaikan latihan gerak ringan.</p><div className="note-tags"><span><Check size={13} /> Aktivitas tercatat</span><span><Check size={13} /> Kondisi umum</span><span><Check size={13} /> Asupan makan</span></div></div><div className="note-card incomplete"><div className="note-card-header"><div className="avatar avatar-purple">DL</div><div><strong>Dewi Lestari</strong><span>Hari ini, 10.12 · Ibu Sari Wulandari</span></div><span className="status-pill amber">Belum lengkap</span></div><p>Catatan kunjungan belum dikirim. Lengkapi sebelum pergantian shift sore.</p><button className="text-btn">Lengkapi catatan <ArrowRight size={14} /></button></div></section><section className="panel update-panel"><PanelTitle title="Update untuk keluarga" action="Bantuan" /><div className={`review-status ${update.status}`}><div className="status-check">{update.status === 'approved' ? <Check size={16} /> : <Sparkles size={16} />}</div><div><strong>{update.status === 'approved' ? 'Sudah disetujui' : 'Draf siap ditinjau'}</strong><span>{update.status === 'approved' ? 'Tampil di halaman keluarga.' : 'Baca kembali sebelum membagikan.'}</span></div></div><label className="field-label">Isi update</label><textarea className="update-text" value={update.text} readOnly /><p className="helper"><ShieldCheck size={14} /> Draf ini dibuat dari catatan kunjungan. Tinjau isinya sebelum disetujui.</p><div className="button-row"><button className="btn secondary" onClick={generateDraft}><Sparkles size={16} /> Buat draf</button><button className="btn primary" onClick={approveUpdate}><Check size={16} /> Setujui update</button></div><div className="handover"><div className="handover-icon"><ArrowRight size={16} /></div><div><strong>Ringkasan pergantian shift</strong><p>Hendra dapat melanjutkan aktivitas ringan sesuai toleransi. Perhatikan asupan makan siang dan catat perubahan kondisi umum.</p></div></div></section></div><div className="privacy-strip"><ShieldCheck size={17} /><span>CareOps bukan alat diagnosis. Semua informasi di halaman ini bersifat operasional dan menggunakan data simulasi.</span></div></> }
function CaregiverPage({ visits, onCheckIn, onComplete, onOpen }) { const ownVisits = visits.filter((v) => v.caregiver === 'Dewi Lestari'); return <div className="caregiver-view"><div className="caregiver-mobile-header"><div className="brand-mark"><HeartPulse size={18} /></div><strong>careops</strong><Bell size={19} /></div><div className="caregiver-greeting"><p className="eyebrow">Selasa, 18 Agustus 2026</p><h1>Selamat pagi, Dewi</h1><p>Siap mendampingi 2 kunjungan hari ini?</p></div><div className="caregiver-stat-banner"><div><span>Kunjungan hari ini</span><strong>2</strong></div><div className="banner-divider" /><div><span>Selesai</span><strong>{ownVisits.filter((v) => v.status === 'completed').length}</strong></div><div className="banner-progress"><i style={{ width: '50%' }} /></div></div><div className="mobile-section-title"><h2>Tugas hari ini</h2><span>2 kunjungan</span></div><div className="mobile-visits">{ownVisits.map((visit) => <div className={`mobile-visit-card ${visit.status}`} key={visit.id}><div className="mobile-visit-top"><span className="mobile-time"><Clock3 size={15} /> {visit.time}</span><span className={`status-pill ${visit.status === 'completed' ? 'green' : visit.status === 'checked-in' ? 'blue' : 'slate'}`}>{visit.status === 'completed' ? 'Selesai' : visit.status === 'checked-in' ? 'Berlangsung' : 'Terjadwal'}</span></div><div className="mobile-client"><div className="avatar avatar-purple">{visit.initials}</div><div><h3>{visit.client}</h3><p>{visit.type}</p><span><span className="location-dot" /> {visit.location}</span></div></div>{visit.status === 'scheduled' && <button className="btn primary full" onClick={() => onCheckIn(visit)}>Mulai kunjungan <ArrowRight size={16} /></button>}{visit.status === 'checked-in' && <div className="mobile-actions"><button className="btn secondary" onClick={() => onOpen(visit)}><FileText size={16} /> Isi catatan</button><button className="btn primary" onClick={() => onComplete(visit)}><CheckCircle2 size={16} /> Selesaikan</button></div>}{visit.status === 'completed' && <div className="completed-note"><CheckCircle2 size={16} /> Catatan sudah dikirim</div>}</div>)}</div><div className="mobile-safety"><ShieldCheck size={18} /><div><strong>Pengingat pendampingan</strong><span>Catat kondisi yang terlihat dan kegiatan yang dilakukan. Jangan memasukkan diagnosis atau saran obat.</span></div></div></div> }
function FamilyPage({ update, client }) { return <div className="family-view"><div className="family-top"><div className="brand"><div className="brand-mark"><HeartPulse size={19} /></div><div><strong>careops</strong><span>INDONESIA</span></div></div><button className="icon-btn"><Bell size={18} /></button></div><div className="family-hero"><p className="eyebrow">Ruang keluarga · Demo</p><h1>Update pendampingan<br /><em>{client.client}</em></h1><p>Informasi singkat dari tim pendamping hari ini.</p></div><div className="family-card"><div className="family-card-top"><div className="avatar avatar-blue">{client.initials}</div><div><strong>{client.client}</strong><span>Pembaruan terakhir · Hari ini, 12.15</span></div><span className="approved-check"><Check size={14} /></span></div><div className="family-update-content"><div className="quote-mark">“</div><p>{update.status === 'approved' ? update.text : 'Update hari ini sedang ditinjau oleh koordinator. Informasi akan tampil setelah disetujui.'}</p></div><div className="family-card-footer"><span><CheckCircle2 size={15} /> Disetujui koordinator</span><span>Hari ini</span></div></div><div className="family-info-grid"><div><span>Kunjungan berikutnya</span><strong>Besok, 08.00</strong></div><div><span>Caregiver</span><strong>{client.caregiver}</strong></div></div><div className="family-contact"><MessageCircle size={18} /><div><strong>Butuh bantuan?</strong><span>Hubungi koordinator CareOps untuk pertanyaan seputar jadwal.</span></div><ArrowRight size={17} /></div><p className="demo-footnote"><ShieldCheck size={14} /> Ini adalah tampilan demo menggunakan data simulasi.</p></div> }
function VisitModal({ visit, onClose, onCheckIn, onComplete, onSave }) { const [note, setNote] = useState(visit.note || ''); const [saved, setSaved] = useState(Boolean(visit.note)); return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Detail kunjungan</p><h2>{visit.client}</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div><div className="modal-meta"><span><Clock3 size={15} /> {visit.time}</span><span><UserRound size={15} /> {visit.caregiver}</span><span><span className="location-dot" /> {visit.location}</span></div>{visit.status === 'scheduled' && <div className="modal-start"><div className="modal-start-icon"><CalendarDays size={23} /></div><div><strong>Kunjungan belum dimulai</strong><p>Mulai check-in saat caregiver tiba di lokasi.</p></div><button className="btn primary" onClick={() => onCheckIn(visit)}>Mulai</button></div>}{visit.status !== 'scheduled' && <><label className="field-label">Catatan perawatan</label><textarea className="note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tuliskan kondisi yang terlihat dan kegiatan yang dilakukan..." /><div className="modal-guidance"><Sparkles size={15} /><span>Catatan akan dipakai untuk menyiapkan draf ringkasan pergantian shift dan update keluarga.</span></div><div className="button-row"><button className="btn secondary" onClick={() => { setSaved(true); onSave?.(note); onClose() }}><Check size={16} /> {saved ? 'Catatan tersimpan' : 'Simpan catatan'}</button>{visit.status === 'checked-in' && <button className="btn primary" onClick={() => onComplete(visit)}><CheckCircle2 size={16} /> Selesaikan</button>}</div></>}</div></div> }

export default App
