import React from 'react'
import { Link } from 'react-router-dom'
import { MdWork, MdEvent, MdCheckCircle, MdCancel, MdAdd, MdArrowForward } from 'react-icons/md'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import { StagesPie, MonthlyBar } from '../../components/Charts/Charts.jsx'
import { formatDate, statusBadgeClass, isUpcoming } from '../../utils/helpers.js'

export default function Dashboard() {
  const { applications } = useAppCtx()

  const total      = applications.length
  const interviews = applications.filter(a => a.status === 'Interview Scheduled').length
  const offers     = applications.filter(a => a.status === 'Offer Received').length
  const rejected   = applications.filter(a => a.status === 'Rejected').length

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5)

  const upcoming = applications
    .filter(a => a.status === 'Interview Scheduled' || (a.interviewDate && isUpcoming(a.interviewDate)))
    .sort((a, b) => {
      const aDate = a.interviewDate ? new Date(a.interviewDate) : new Date(0)
      const bDate = b.interviewDate ? new Date(b.interviewDate) : new Date(0)
      return aDate - bDate
    })
    .slice(0, 3)

  return (
    <div className="fade-up">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Your job search at a glance</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <MdAdd size={17} /> Add Job
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon si-purple"><MdWork /></div>
          <div><div className="stat-num">{total}</div><div className="stat-label">Total Applied</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-yellow"><MdEvent /></div>
          <div><div className="stat-num">{interviews}</div><div className="stat-label">Interviews</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-green"><MdCheckCircle /></div>
          <div><div className="stat-num">{offers}</div><div className="stat-label">Offers</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-red"><MdCancel /></div>
          <div><div className="stat-num">{rejected}</div><div className="stat-label">Rejected</div></div>
        </div>
      </div>

      {/* Charts */}
      <div className="dash-charts">
        <div className="card">
          <div className="card-title">Application Stages</div>
          <StagesPie applications={applications} />
        </div>
        <div className="card">
          <div className="card-title">Monthly Applications</div>
          <MonthlyBar applications={applications} />
        </div>
      </div>

      <div className="dash-bottom">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex-between mb-3">
            <div className="card-title" style={{ margin: 0 }}>Recent Applications</div>
            <Link to="/applications" className="btn btn-ghost btn-sm">
              View All <MdArrowForward size={13} />
            </Link>
          </div>
          {recent.length === 0
            ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <h3>No applications yet</h3>
                <p>Start tracking your job applications</p>
                <Link to="/applications/new" className="btn btn-primary btn-sm">
                  <MdAdd size={14} /> Add First Job
                </Link>
              </div>
            )
            : recent.map(app => (
              <div key={app.id} className="recent-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{app.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{app.company}</div>
                </div>
                <div className="flex-center gap-2">
                  <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDate(app.appliedDate)}</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div className="card-title">Upcoming Interviews</div>
          {upcoming.length === 0
            ? <p style={{ color: 'var(--text3)', fontSize: 13 }}>No upcoming interviews scheduled.</p>
            : upcoming.map(app => (
              <div key={app.id} className="interview-item">
                <span style={{ fontSize: 22 }}>📅</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{app.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{app.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
                    {formatDate(app.interviewDate)}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
