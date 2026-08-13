// CareOps Indonesia — data simulasi (bukan data pasien nyata)
// Semua isi di sini adalah contoh untuk demo produk.

export const clients = [
  {
    id: 'c1', name: 'Ibu Sari Wulandari', initials: 'SW', age: 72, gender: 'Perempuan',
    city: 'Kebayoran Baru', area: 'Jakarta Selatan', careType: 'Perawatan harian', careLevel: 'Sedang',
    conditions: ['Hipertensi terkontrol', 'Mobilitas ringan terbatas'], allergies: ['Tidak ada'],
    diet: 'Rendah garam, tinggi serat', mobility: 'Bantuan berjalan ringan',
    caregiver: 'Dewi Lestari', nextVisit: 'Hari ini, 08.00', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Rizky Wulandari', relation: 'Anak', phone: '0812-xxxx-0001' },
    carePlan: ['Pantau tekanan darah pagi dan sore', 'Dampingi senam ringan 20 menit', 'Ingatkan minum obat sesuai jadwal', 'Siapkan makanan rendah garam'],
    vitals: [
      { date: '12/08', sistolik: 138, diastolik: 86, nadi: 76 },
      { date: '13/08', sistolik: 132, diastolik: 84, nadi: 74 },
      { date: '14/08', sistolik: 135, diastolik: 85, nadi: 78 },
      { date: '15/08', sistolik: 128, diastolik: 82, nadi: 72 },
      { date: '16/08', sistolik: 130, diastolik: 83, nadi: 75 },
      { date: '17/08', sistolik: 126, diastolik: 81, nadi: 73 },
      { date: '18/08', sistolik: 124, diastolik: 80, nadi: 72 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Dewi Lestari', note: 'Tekanan darah stabil. Senam ringan selesai.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Dewi Lestari', note: 'Nafsu makan baik. Tidak ada keluhan baru.', status: 'Selesai' },
    ],
  },
  {
    id: 'c2', name: 'Bapak Hendra Wijaya', initials: 'HW', age: 68, gender: 'Laki-laki',
    city: 'Cilandak', area: 'Jakarta Selatan', careType: 'Pemulihan mobilitas', careLevel: 'Tinggi',
    conditions: ['Pemulihan pasca stroke', 'Latihan gerak aktif'], allergies: ['Penicillin'],
    diet: 'Lunak, mudah ditelan', mobility: 'Kursi roda dengan bantuan',
    caregiver: 'Rina Maharani', nextVisit: 'Sedang berlangsung', status: 'Perlu perhatian', statusTone: 'amber',
    familyContact: { name: 'Ardian Wijaya', relation: 'Anak', phone: '0812-xxxx-0002' },
    carePlan: ['Latihan gerak aktif 30 menit', 'Perhatikan asupan dan cara menelan', 'Catat perubahan kondisi umum', 'Hindari makanan yang sulit dikunyah'],
    vitals: [
      { date: '12/08', sistolik: 144, diastolik: 88, nadi: 82 },
      { date: '13/08', sistolik: 140, diastolik: 87, nadi: 80 },
      { date: '14/08', sistolik: 138, diastolik: 86, nadi: 81 },
      { date: '15/08', sistolik: 141, diastolik: 88, nadi: 83 },
      { date: '16/08', sistolik: 137, diastolik: 85, nadi: 80 },
      { date: '17/08', sistolik: 136, diastolik: 85, nadi: 79 },
      { date: '18/08', sistolik: 134, diastolik: 84, nadi: 78 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Rina Maharani', note: 'Latihan gerak selesai. Asupan makan cukup.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Rina Maharani', note: 'Lebih bugar. Nafsu makan baik.', status: 'Selesai' },
    ],
  },
  {
    id: 'c3', name: 'Ibu Ratna Kusuma', initials: 'RK', age: 79, gender: 'Perempuan',
    city: 'Pondok Indah', area: 'Jakarta Selatan', careType: 'Pendampingan siang', careLevel: 'Tinggi',
    conditions: ['Gangguan memori ringan', 'Osteoporosis'], allergies: ['Tidak ada'],
    diet: 'Tinggi kalsium', mobility: 'Bantuan berjalan',
    caregiver: 'Siti Aminah', nextVisit: 'Hari ini, 13.00', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Maya Kusuma', relation: 'Anak', phone: '0812-xxxx-0003' },
    carePlan: ['Dampingi aktivitas siang', 'Ingatkan minum cukup', 'Bantu orientasi waktu dan tempat', 'Dampingi jalan pendek di sore hari'],
    vitals: [
      { date: '12/08', sistolik: 136, diastolik: 84, nadi: 74 },
      { date: '13/08', sistolik: 134, diastolik: 83, nadi: 75 },
      { date: '14/08', sistolik: 133, diastolik: 83, nadi: 73 },
      { date: '15/08', sistolik: 135, diastolik: 84, nadi: 76 },
      { date: '16/08', sistolik: 131, diastolik: 82, nadi: 74 },
      { date: '17/08', sistolik: 130, diastolik: 81, nadi: 73 },
      { date: '18/08', sistolik: 129, diastolik: 81, nadi: 74 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Siti Aminah', note: 'Aktivitas siang lancar. Orientasi membaik.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Siti Aminah', note: 'Jalan pendek selesai tanpa keluhan.', status: 'Selesai' },
    ],
  },
  {
    id: 'c4', name: 'Bapak Agus Santoso', initials: 'AS', age: 70, gender: 'Laki-laki',
    city: 'Tebet', area: 'Jakarta Selatan', careType: 'Pendampingan harian', careLevel: 'Rendah',
    conditions: ['Diabetes terkontrol', 'Ringan'], allergies: ['Tidak ada'],
    diet: 'Rendah gula', mobility: 'Mandiri',
    caregiver: 'Dewi Lestari', nextVisit: 'Selesai hari ini', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Indah Santoso', relation: 'Anak', phone: '0812-xxxx-0004' },
    carePlan: ['Pantau gula darah sesuai jadwal', 'Dampingi olahraga ringan', 'Ingatkan pola makan rendah gula'],
    vitals: [
      { date: '12/08', sistolik: 128, diastolik: 82, nadi: 70 },
      { date: '13/08', sistolik: 127, diastolik: 81, nadi: 71 },
      { date: '14/08', sistolik: 129, diastolik: 82, nadi: 70 },
      { date: '15/08', sistolik: 126, diastolik: 80, nadi: 72 },
      { date: '16/08', sistolik: 125, diastolik: 80, nadi: 71 },
      { date: '17/08', sistolik: 124, diastolik: 79, nadi: 70 },
      { date: '18/08', sistolik: 123, diastolik: 79, nadi: 71 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Dewi Lestari', note: 'Olahraga ringan selesai. Gula stabil.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Dewi Lestari', note: 'Tidak ada keluhan. Pola makan baik.', status: 'Selesai' },
    ],
  },
  {
    id: 'c5', name: 'Ibu Dewi Kartika', initials: 'DK', age: 75, gender: 'Perempuan',
    city: 'Kemang', area: 'Jakarta Selatan', careType: 'Rehabilitasi pasca operasi', careLevel: 'Tinggi',
    conditions: ['Pasca operasi pinggul', 'Pemulihan kekuatan'], allergies: ['Sulfa'],
    diet: 'Tinggi protein', mobility: 'Walker dengan bantuan',
    caregiver: 'Maya Pratiwi', nextVisit: 'Besok, 09.00', status: 'Perlu perhatian', statusTone: 'amber',
    familyContact: { name: 'Rian Kartika', relation: 'Anak', phone: '0812-xxxx-0005' },
    carePlan: ['Latihan penguatan bertahap', 'Dampingi berjalan dengan walker', 'Perhatikan area bekas operasi', 'Ingatkan jadwal kontrol'],
    vitals: [
      { date: '12/08', sistolik: 142, diastolik: 88, nadi: 84 },
      { date: '13/08', sistolik: 140, diastolik: 87, nadi: 83 },
      { date: '14/08', sistolik: 139, diastolik: 86, nadi: 82 },
      { date: '15/08', sistolik: 138, diastolik: 86, nadi: 82 },
      { date: '16/08', sistolik: 137, diastolik: 85, nadi: 81 },
      { date: '17/08', sistolik: 136, diastolik: 85, nadi: 80 },
      { date: '18/08', sistolik: 135, diastolik: 84, nadi: 80 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Maya Pratiwi', note: 'Latihan penguatan tahap awal selesai.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Maya Pratiwi', note: 'Berjalan dengan walker membaik.', status: 'Selesai' },
    ],
  },
  {
    id: 'c6', name: 'Bapak Bambang Purnomo', initials: 'BP', age: 81, gender: 'Laki-laki',
    city: 'Bintaro', area: 'Tangerang Selatan', careType: 'Perawatan lansia', careLevel: 'Tinggi',
    conditions: ['Mobilitas terbatas', 'Penglihatan menurun'], allergies: ['Tidak ada'],
    diet: 'Lunak', mobility: 'Kursi roda',
    caregiver: 'Siti Aminah', nextVisit: 'Besok, 10.30', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Dina Purnomo', relation: 'Anak', phone: '0812-xxxx-0006' },
    carePlan: ['Bantu aktivitas harian', 'Perhatikan asupan makan', 'Dampingi posisi duduk yang nyaman'],
    vitals: [
      { date: '12/08', sistolik: 140, diastolik: 85, nadi: 79 },
      { date: '13/08', sistolik: 139, diastolik: 85, nadi: 78 },
      { date: '14/08', sistolik: 138, diastolik: 84, nadi: 78 },
      { date: '15/08', sistolik: 139, diastolik: 85, nadi: 79 },
      { date: '16/08', sistolik: 137, diastolik: 84, nadi: 77 },
      { date: '17/08', sistolik: 137, diastolik: 83, nadi: 78 },
      { date: '18/08', sistolik: 136, diastolik: 83, nadi: 77 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Siti Aminah', note: 'Aktivitas harian lancar.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Siti Aminah', note: 'Asupan makan cukup. Tidak ada keluhan.', status: 'Selesai' },
    ],
  },
  {
    id: 'c7', name: 'Ibu Lestari Handayani', initials: 'LH', age: 66, gender: 'Perempuan',
    city: 'Pejaten', area: 'Jakarta Selatan', careType: 'Pendampingan', careLevel: 'Rendah',
    conditions: ['Artritis ringan'], allergies: ['Tidak ada'],
    diet: 'Seimbang', mobility: 'Mandiri',
    caregiver: 'Maya Pratiwi', nextVisit: 'Lusa, 08.30', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Fajar Handayani', relation: 'Anak', phone: '0812-xxxx-0007' },
    carePlan: ['Dampingi senam ringan', 'Ingatkan minum cukup', 'Bantu kegiatan rumah ringan'],
    vitals: [
      { date: '12/08', sistolik: 126, diastolik: 80, nadi: 72 },
      { date: '13/08', sistolik: 125, diastolik: 80, nadi: 73 },
      { date: '14/08', sistolik: 127, diastolik: 81, nadi: 72 },
      { date: '15/08', sistolik: 124, diastolik: 79, nadi: 71 },
      { date: '16/08', sistolik: 124, diastolik: 79, nadi: 72 },
      { date: '17/08', sistolik: 123, diastolik: 78, nadi: 71 },
      { date: '18/08', sistolik: 122, diastolik: 78, nadi: 71 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Maya Pratiwi', note: 'Senam ringan selesai.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Maya Pratiwi', note: 'Kondisi stabil.', status: 'Selesai' },
    ],
  },
  {
    id: 'c8', name: 'Bapak Yudi Hermawan', initials: 'YH', age: 74, gender: 'Laki-laki',
    city: 'Pasar Minggu', area: 'Jakarta Selatan', careType: 'Perawatan harian', careLevel: 'Sedang',
    conditions: ['Parkinson ringan', 'Tremor tangan'], allergies: ['Tidak ada'],
    diet: 'Mudah ditelan', mobility: 'Bantuan berjalan',
    caregiver: 'Rina Maharani', nextVisit: 'Lusa, 11.00', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Novi Hermawan', relation: 'Anak', phone: '0812-xxxx-0008' },
    carePlan: ['Dampingi makan dengan hati-hati', 'Latihan gerak halus', 'Perhatikan keseimbangan'],
    vitals: [
      { date: '12/08', sistolik: 134, diastolik: 84, nadi: 77 },
      { date: '13/08', sistolik: 133, diastolik: 83, nadi: 76 },
      { date: '14/08', sistolik: 132, diastolik: 83, nadi: 77 },
      { date: '15/08', sistolik: 133, diastolik: 84, nadi: 76 },
      { date: '16/08', sistolik: 131, diastolik: 82, nadi: 75 },
      { date: '17/08', sistolik: 130, diastolik: 82, nadi: 75 },
      { date: '18/08', sistolik: 130, diastolik: 81, nadi: 74 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Rina Maharani', note: 'Makan lancar. Tremor stabil.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Rina Maharani', note: 'Latihan gerak halus selesai.', status: 'Selesai' },
    ],
  },
  {
    id: 'c9', name: 'Ibu Nani Rahayu', initials: 'NR', age: 71, gender: 'Perempuan',
    city: 'Kemang', area: 'Jakarta Selatan', careType: 'Pendampingan siang', careLevel: 'Sedang',
    conditions: ['Artritis ringan'], allergies: ['Tidak ada'],
    diet: 'Seimbang', mobility: 'Bantuan berjalan ringan',
    caregiver: 'Dewi Lestari', nextVisit: 'Sedang berlangsung', status: 'Stabil', statusTone: 'green',
    familyContact: { name: 'Rani Rahayu', relation: 'Anak', phone: '0812-xxxx-0009' },
    carePlan: ['Dampingi aktivitas siang', 'Ingatkan minum cukup', 'Dampingi jalan ringan'],
    vitals: [
      { date: '12/08', sistolik: 132, diastolik: 82, nadi: 75 },
      { date: '13/08', sistolik: 131, diastolik: 82, nadi: 74 },
      { date: '14/08', sistolik: 130, diastolik: 81, nadi: 75 },
      { date: '15/08', sistolik: 129, diastolik: 81, nadi: 73 },
      { date: '16/08', sistolik: 128, diastolik: 80, nadi: 74 },
      { date: '17/08', sistolik: 127, diastolik: 80, nadi: 73 },
      { date: '18/08', sistolik: 126, diastolik: 79, nadi: 73 },
    ],
    visitHistory: [
      { date: '16/08', caregiver: 'Dewi Lestari', note: 'Aktivitas siang lancar.', status: 'Selesai' },
      { date: '17/08', caregiver: 'Dewi Lestari', note: 'Jalan ringan selesai tanpa keluhan.', status: 'Selesai' },
    ],
  },
]

export const caregivers = [
  { id: 'g1', name: 'Dewi Lestari', initials: 'DL', role: 'Caregiver senior', specialty: 'Perawatan lansia', rating: 4.9, visitsToday: 2, completedToday: 1, status: 'Bertugas', tone: 'green', color: 'purple' },
  { id: 'g2', name: 'Rina Maharani', initials: 'RM', role: 'Caregiver', specialty: 'Rehabilitasi gerak', rating: 4.8, visitsToday: 1, completedToday: 0, status: 'Sedang kunjungan', tone: 'blue', color: 'blue' },
  { id: 'g3', name: 'Siti Aminah', initials: 'SA', role: 'Caregiver', specialty: 'Pendampingan harian', rating: 4.9, visitsToday: 2, completedToday: 0, status: 'Bertugas', tone: 'green', color: 'orange' },
  { id: 'g4', name: 'Maya Pratiwi', initials: 'MP', role: 'Caregiver pengganti', specialty: 'Rehabilitasi pasca operasi', rating: 4.7, visitsToday: 1, completedToday: 0, status: 'Siap ditugaskan', tone: 'slate', color: 'pink' },
]

export const initialVisits = [
  { id: 1, client: 'Ibu Sari Wulandari', clientId: 'c1', initials: 'SW', caregiver: 'Dewi Lestari', time: '08.00 – 10.00', type: 'Perawatan pagi', status: 'scheduled', location: 'Kebayoran Baru', checklist: [
    { label: 'Pantau tekanan darah', done: false }, { label: 'Senam ringan 20 menit', done: false }, { label: 'Ingatkan obat pagi', done: false }, { label: 'Siapkan sarapan rendah garam', done: false },
  ] },
  { id: 2, client: 'Bapak Hendra Wijaya', clientId: 'c2', initials: 'HW', caregiver: 'Rina Maharani', time: '10.30 – 12.00', type: 'Pendampingan aktivitas', status: 'checked-in', location: 'Cilandak', checklist: [
    { label: 'Latihan gerak aktif 30 menit', done: true }, { label: 'Perhatikan cara menelan', done: true }, { label: 'Catat kondisi umum', done: true }, { label: 'Siapkan makan siang lunak', done: false },
  ] },
  { id: 3, client: 'Ibu Ratna Kusuma', clientId: 'c3', initials: 'RK', caregiver: 'Siti Aminah', time: '13.00 – 15.00', type: 'Pendampingan siang', status: 'scheduled', location: 'Pondok Indah', checklist: [
    { label: 'Dampingi aktivitas siang', done: false }, { label: 'Bantu orientasi waktu', done: false }, { label: 'Dampingi jalan pendek', done: false },
  ] },
  { id: 4, client: 'Bapak Agus Santoso', clientId: 'c4', initials: 'AS', caregiver: 'Dewi Lestari', time: '16.00 – 18.00', type: 'Pendampingan sore', status: 'completed', location: 'Tebet', checklist: [
    { label: 'Pantau gula darah', done: true }, { label: 'Olahraga ringan', done: true }, { label: 'Ingatkan pola makan', done: true },
  ] },
  { id: 5, client: 'Ibu Nani Rahayu', clientId: 'c9', initials: 'NR', caregiver: 'Dewi Lestari', time: '11.00 – 12.30', type: 'Pendampingan siang', status: 'checked-in', location: 'Kemang', checklist: [
    { label: 'Dampingi aktivitas siang', done: true }, { label: 'Ingatkan minum cukup', done: false }, { label: 'Dampingi jalan ringan', done: false },
  ] },
]

export const incidents = [
  { id: 'i1', title: 'Catatan kunjungan belum lengkap', client: 'Ibu Sari Wulandari', category: 'Dokumentasi', severity: 'sedang', status: 'open', detail: 'Kunjungan pukul 08.00 belum memiliki catatan perawatan.', time: '15 menit lalu' },
  { id: 'i2', title: 'Pergantian caregiver kunjungan sore', client: 'Bapak Agus Santoso', category: 'Penugasan', severity: 'tinggi', status: 'open', detail: 'Dewi Lestari meminta penggantian untuk kunjungan sore.', time: '1 jam lalu' },
  { id: 'i3', title: 'Perubahan jadwal kontrol', client: 'Ibu Dewi Kartika', category: 'Jadwal', severity: 'sedang', status: 'review', detail: 'Keluarga mengusulkan jadwal kontrol digeser ke Jumat.', time: '2 jam lalu' },
  { id: 'i4', title: 'Update keluarga disetujui', client: 'Bapak Hendra Wijaya', category: 'Komunikasi', severity: 'rendah', status: 'resolved', detail: 'Update pendampingan telah ditinjau dan disetujui.', time: '2 jam lalu' },
]

export const weeklyTrend = [
  { day: 'Sen', kunjungan: 12, selesai: 11 },
  { day: 'Sel', kunjungan: 14, selesai: 12 },
  { day: 'Rab', kunjungan: 13, selesai: 13 },
  { day: 'Kam', kunjungan: 15, selesai: 13 },
  { day: 'Jum', kunjungan: 14, selesai: 14 },
  { day: 'Sab', kunjungan: 9, selesai: 8 },
  { day: 'Min', kunjungan: 7, selesai: 7 },
]

export const statusDistribution = [
  { name: 'Selesai', value: 22, color: '#198b68' },
  { name: 'Berlangsung', value: 4, color: '#3666f6' },
  { name: 'Terjadwal', value: 8, color: '#94a3b8' },
  { name: 'Terlewat', value: 1, color: '#e05d5d' },
]

export const caregiverLoad = [
  { name: 'Dewi', kunjungan: 12, selesai: 11 },
  { name: 'Rina', kunjungan: 9, selesai: 8 },
  { name: 'Siti', kunjungan: 10, selesai: 9 },
  { name: 'Maya', kunjungan: 6, selesai: 6 },
]

export const INITIAL_FAMILY_UPDATE = {
  status: 'draft',
  text: 'Bapak Hendra menjalani aktivitas pagi dengan baik. Ia mengikuti latihan gerak ringan dan makan dengan cukup. Tidak ada keluhan baru yang dicatat selama kunjungan.',
}

export const STORAGE_KEY = 'careops-visits-v3'
