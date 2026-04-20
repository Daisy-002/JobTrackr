import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MdAdd, MdViewModule, MdViewList,
  MdEdit, MdDelete, MdBookmark, MdBookmarkBorder, MdTune,
} from 'react-icons/md'
import { toast } from 'react-toastify'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import Filters from '../../components/Filters/Filters.jsx'
import JobCard from '../../components/JobCard/JobCard.jsx'
import { formatDate, formatSalary, statusBadgeClass } from '../../utils/helpers.js'

// PRD: Tabs for Job Pipeline
const TABS = [
  { label: 'All',          key: 'All' },
  { label: 'Applied',      key: 'Applied' },
  { label: 'Interview',    key: 'Interview Scheduled' },
  { label: 'Offer',        key: 'Offer Received' },
  { label: 'Rejected',     key: 'Rejected' },
  { label: 'Bookmarked',   key: 'Bookmarked' },
]

export default function Applications() {
  const { applications, deleteApplication, toggleBookmark } = useAppCtx()
  const [view, setView] = useState('card')        // PRD: card or table view
  const [showFilters, setShowFilters] = useState(false)

  const hook = useApplications(applications)
  const {
    filtered, search, setSearch,
    statusFilter, setStatusFilter,
    platformFilter, setPlatform,
    locFilter, setLocFilter,
    sortBy, sortDir, handleSort,
    activeTab, setActiveTab,
    uniquePlatforms,
  } = hook

  function getCount(key) {
    if (key === 'All') return applications.length
    if (key === 'Bookmarked') return applications.filter(a => a.bookmarked).length
    return applications.filter(a => a.status === key).length
  }

  function handleDelete(app) {
    if (window.confirm(`Delete ${app.role} at ${app.company}?`)) {
      deleteApplication(app.id)
      toast.success('Deleted')
    }
  }

  function handleBookmark(app) {
    toggleBookmark(app.id)
    toast.success(app.bookmarked ? 'Removed from bookmarks' : 'Bookmarked!')
  }

  return (
    <div className="fade-up">
      <div className="page-head">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-sub">{filtered.length} of {applications.length} shown</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <MdAdd size={17} /> Add Job
        </Link>
      </div>

      {/* PRD: Tabs — Applied, Interview Scheduled, Offer Received, Rejected */}
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab ${activeTab === t.key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
            <span className="tab-pill">{getCount(t.key)}</span>
          </button>
        ))}
      </div>

      {/* Toolbar: search + filter toggle + view toggle */}
      <div className="toolbar">
        {/* PRD: Search bar */}
        <SearchBar value={search} onChange={setSearch} />

        <button
          className={`btn btn-ghost btn-sm ${showFilters ? '' : ''}`}
          onClick={() => setShowFilters(p => !p)}
        >
          <MdTune size={15} /> Filters
        </button>

        {/* PRD: Card / Table view toggle */}
        <div className="view-toggle">
          <button className={`vt-btn ${view === 'card' ? 'vt-active' : ''}`} onClick={() => setView('card')} title="Card view">
            <MdViewModule />
          </button>
          <button className={`vt-btn ${view === 'table' ? 'vt-active' : ''}`} onClick={() => setView('table')} title="Table view">
            <MdViewList />
          </button>
        </div>
      </div>

      {/* PRD: Filters — status, platform, location type */}
      {showFilters && (
        <div className="card" style={{ marginBottom: 16 }}>
          <Filters
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            platformFilter={platformFilter} setPlatform={setPlatform}
            locFilter={locFilter} setLocFilter={setLocFilter}
            sortBy={sortBy} sortDir={sortDir} handleSort={handleSort}
            uniquePlatforms={uniquePlatforms}
          />
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card empty">
          <div className="empty-icon">🔍</div>
          <h3>No applications found</h3>
          <p>Try adjusting your search or filters</p>
          <Link to="/applications/new" className="btn btn-primary btn-sm">
            <MdAdd size={14} /> Add Job
          </Link>
        </div>
      )}

      {/* Card view */}
      {filtered.length > 0 && view === 'card' && (
        <div className="cards-grid">
          {filtered.map(app => <JobCard key={app.id} app={app} />)}
        </div>
      )}

      {/* PRD: Table view with sorting */}
      {filtered.length > 0 && view === 'table' && (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('company')}>
                  Company {sortBy === 'company' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Role</th>
                <th>Status</th>
                <th onClick={() => handleSort('appliedDate')}>
                  Applied {sortBy === 'appliedDate' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('salary')}>
                  Salary {sortBy === 'salary' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Platform</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 700 }}>{app.company}</td>
                  <td style={{ color: 'var(--text2)' }}>{app.role}</td>
                  <td><span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span></td>
                  <td style={{ color: 'var(--text3)', fontSize: 13 }}>{formatDate(app.appliedDate)}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600, fontSize: 13 }}>{formatSalary(app.salary)}</td>
                  <td style={{ color: 'var(--text3)', fontSize: 13 }}>{app.platform || '—'}</td>
                  <td style={{ color: 'var(--text3)', fontSize: 13 }}>{app.location || '—'}</td>
                  <td>
                    <div className="flex-center gap-2">
                      <button
                        className={`btn btn-icon btn-ghost btn-xs ${app.bookmarked ? 'bookmark-active' : ''}`}
                        onClick={() => handleBookmark(app)}
                        title="Bookmark"
                      >
                        {app.bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
                      </button>
                      <Link to={`/applications/${app.id}`} className="btn btn-icon btn-ghost btn-xs" title="Edit">
                        <MdEdit />
                      </Link>
                      <button className="btn btn-icon btn-danger btn-xs" onClick={() => handleDelete(app)} title="Delete">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
