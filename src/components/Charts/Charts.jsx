import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const STATUS_COLORS = {
  'Applied':             '#3b82f6',
  'Shortlisted':         '#f97316',
  'Interview Scheduled': '#f59e0b',
  'Offer Received':      '#22c55e',
  'Rejected':            '#ef4444',
}

function TT({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e6ef', borderRadius: 8, padding: '8px 14px', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ fontWeight: 700, color: '#0f1117' }}>{payload[0].name}</p>
      <p style={{ color: '#4b5268' }}>Count: <b>{payload[0].value}</b></p>
    </div>
  )
}

// PRD: Pie chart of application stages
export function StagesPie({ applications }) {
  const data = Object.entries(STATUS_COLORS).map(([name, color]) => ({
    name, color, value: applications.filter(a => a.status === name).length,
  })).filter(d => d.value > 0)

  if (!data.length) return <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip content={<TT />} />
        <Legend formatter={v => <span style={{ color: 'var(--text2)', fontSize: 12 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// PRD: Monthly applications graph
export function MonthlyBar({ applications }) {
  const map = {}
  applications.forEach(a => {
    if (!a.appliedDate) return
    const key = new Date(a.appliedDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    map[key] = (map[key] || 0) + 1
  })

  const data = Object.entries(map).map(([month, count]) => ({ month, count })).slice(-6)

  if (!data.length) return <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<TT />} cursor={{ fill: 'rgba(108,99,255,0.06)' }} />
        <Bar dataKey="count" name="Applications" fill="#6c63ff" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
