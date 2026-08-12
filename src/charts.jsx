import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const tooltipStyle = { borderRadius: 10, border: '1px solid #e8edf2', boxShadow: '0 10px 30px #23343e12', fontSize: 11, fontFamily: 'DM Sans, sans-serif', padding: '10px 12px' }

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="gradKunjungan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3666f6" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#3666f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradSelesai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#50b89c" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#50b89c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#87949e' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#a0abb3' }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#dce3e9' }} />
        <Area type="monotone" dataKey="kunjungan" name="Kunjungan" stroke="#3666f6" strokeWidth={2.5} fill="url(#gradKunjungan)" />
        <Area type="monotone" dataKey="selesai" name="Selesai" stroke="#50b89c" strokeWidth={2.5} fill="url(#gradSelesai)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function StatusDonut({ data }) {
  return (
    <div className="donut-wrap">
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={76} paddingAngle={3} strokeWidth={0}>
            {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center"><strong>35</strong><span>kunjungan</span></div>
    </div>
  )
}

export function LoadBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#87949e' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#a0abb3' }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f5f7f9' }} />
        <Bar dataKey="kunjungan" name="Kunjungan" fill="#cdd8f6" radius={[5, 5, 0, 0]} />
        <Bar dataKey="selesai" name="Selesai" fill="#3666f6" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function VitalsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#87949e' }} />
        <YAxis domain={[60, 160]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#a0abb3' }} width={44} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="sistolik" name="Sistolik" stroke="#3666f6" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="diastolik" name="Diastolik" stroke="#50b89c" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function VitalsPulse({ data }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#87949e' }} />
        <YAxis domain={[55, 95]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#a0abb3' }} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="nadi" name="Denyut" stroke="#7657d8" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
