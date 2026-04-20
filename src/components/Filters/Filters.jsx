import React from 'react'
import { STATUS_LIST, PLATFORM_LIST, LOCATION_TYPES } from '../../utils/helpers.js'
import { MdClose } from 'react-icons/md'

// PRD: Filters — Status, Platform, Location type
export default function Filters({
  statusFilter, setStatusFilter,
  platformFilter, setPlatform,
  locFilter, setLocFilter,
  sortBy, sortDir, handleSort,
  uniquePlatforms,
}) {
  const hasFilters = statusFilter !== 'All' || platformFilter !== 'All' || locFilter !== 'All'
  const platforms = uniquePlatforms.length ? uniquePlatforms : PLATFORM_LIST

  return (
    <div className="filters-row">
      {/* PRD: Status filter */}
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* PRD: Platform filter */}
      <div className="filter-group">
        <label className="filter-label">Platform</label>
        <select className="filter-select" value={platformFilter} onChange={e => setPlatform(e.target.value)}>
          <option value="All">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* PRD: Location type filter */}
      <div className="filter-group">
        <label className="filter-label">Location Type</label>
        <select className="filter-select" value={locFilter} onChange={e => setLocFilter(e.target.value)}>
          <option value="All">All Types</option>
          {LOCATION_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      {/* PRD: Sort */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => handleSort(e.target.value)}
        >
          <option value="appliedDate">Applied Date</option>
          <option value="salary">Salary</option>
          <option value="company">Company Name</option>
        </select>
      </div>

      {hasFilters && (
        <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }}
          onClick={() => { setStatusFilter('All'); setPlatform('All'); setLocFilter('All') }}>
          <MdClose size={13} /> Clear
        </button>
      )}
    </div>
  )
}
