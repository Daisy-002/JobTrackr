import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import { formatSalary } from '../../utils/helpers.js'
import { MdTrendingUp, MdPieChart, MdBarChart, MdShowChart } from 'react-icons/md'

function TT({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e6ef', borderRadius: 8, padding: '8px 14px', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {label && <p style={{ color: 'var(--text3)', marginBottom: 3, fontSize: 12 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'var(--text)', fontWeight: 700 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// PRD: Analytics page — charts and statistics
export default function Analytics() {
  const { applications } = useAppCtx()

  // Status distribution data
  const statusData = [
    { name: 'Applied',             value: applications.filter(a => a.status === 'Applied').length,             color: '#3b82f6' },
    { name: 'Shortlisted',         value: applications.filter(a => a.status === 'Shortlisted').length,         color: '#f97316' },
    { name: 'Interview Scheduled', value: applications.filter(a => a.status === 'Interview Scheduled').length, color: '#f59e0b' },
    { name: 'Offer Received',      value: applications.filter(a => a.status === 'Offer Received').length,      color: '#22c55e' },
    { name: 'Rejected',            value: applications.filter(a => a.status === 'Rejected').length,            color: '#ef4444' },
  ].filter(d => d.value > 0)

  // Platform distribution
  const platformMap = {}
  applications.forEach(a => {
    if (a.platform) platformMap[a.platform] = (platformMap[a.platform] || 0) + 1
  })
  const platformData = Object.entries(platformMap).map(([name, value]) => ({ name, value }))

  // Monthly trend
  const monthMap = {}
  applications.forEach(a => {
    if (!a.appliedDate) return
    const key = new Date(a.appliedDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    monthMap[key] = (monthMap[key] || 0) + 1
  })
  const monthlyData = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

  // Salary buckets
  const salaryBuckets = { '< 5L': 0, '5–10L': 0, '10–15L': 0, '15–20L': 0, '> 20L': 0 }
  applications.forEach(a => {
    const s = Number(a.salary) || 0
    if (s < 500000)       salaryBuckets['< 5L']++
    else if (s < 1000000) salaryBuckets['5–10L']++
    else if (s < 1500000) salaryBuckets['10–15L']++
    else if (s < 2000000) salaryBuckets['15–20L']++
    else                  salaryBuckets['> 20L']++
  })
  const salaryData = Object.entries(salaryBuckets).map(([range, count]) => ({ range, count })).filter(d => d.count > 0)

  // Key metrics
  const total        = applications.length
  const interviewed  = applications.filter(a => ['Interview Scheduled', 'Offer Received', 'Rejected'].includes(a.status)).length
  const offered      = applications.filter(a => a.status === 'Offer Received').length
  const interviewRate = total > 0 ? Math.round((interviewed / total) * 100) : 0
  const offerRate     = interviewed > 0 ? Math.round((offered / interviewed) * 100) : 0
  const salariedApps  = applications.filter(a => a.salary)
  const avgSalary     = salariedApps.length
    ? Math.round(salariedApps.reduce((s, a) => s + Number(a.salary), 0) / salariedApps.length)
    : 0

  const noData = <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0', fontSize: 13 }}>No data yet — add some applications!</div>

  return (
    <div className="fade-up">
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Deep insights into your job search</p>
        </div>
      </div>

      {/* Key metric stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon si-purple"><MdTrendingUp /></div>
          <div><div className="stat-num">{total}</div><div className="stat-label">Total Apps</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-yellow"><MdBarChart /></div>
          <div><div className="stat-num">{interviewRate}%</div><div className="stat-label">Interview Rate</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-green"><MdPieChart /></div>
          <div><div className="stat-num">{offerRate}%</div><div className="stat-label">Offer Rate</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-blue"><MdShowChart /></div>
          <div><div className="stat-num">{avgSalary ? formatSalary(avgSalary) : '—'}</div><div className="stat-label">Avg Salary</div></div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="analytics-grid">

        {/* PRD: Pie chart of application stages */}
        <div className="card">
          <div className="card-title">Status Breakdown</div>
          {statusData.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={88} dataKey="value" paddingAngle={3}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<TT />} />
                <Legend formatter={v => <span style={{ color: 'var(--text2)', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PRD: Monthly applications graph */}
        <div className="card">
          <div className="card-title">Monthly Trend</div>
          {monthlyData.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<TT />} />
                <Line type="monotone" dataKey="count" name="Applications" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div className="card-title">Applications by Platform</div>
          {platformData.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={platformData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#4b5268', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<TT />} cursor={{ fill: 'rgba(108,99,255,0.05)' }} />
                <Bar dataKey="value" name="Applications" fill="#6c63ff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Salary distribution */}
        <div className="card">
          <div className="card-title">Salary Range Distribution</div>
          {salaryData.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salaryData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#9099b5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9099b5', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<TT />} cursor={{ fill: 'rgba(34,197,94,0.05)' }} />
                <Bar dataKey="count" name="Count" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  )
}
