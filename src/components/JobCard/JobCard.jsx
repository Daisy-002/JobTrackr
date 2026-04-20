import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MdEdit, MdDelete, MdBookmark, MdBookmarkBorder,
  MdLocationOn, MdCalendarToday, MdAttachMoney, MdWork,
} from 'react-icons/md'
import { toast } from 'react-toastify'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import { getLogoUrl } from '../../services/api.js'
import { formatDate, formatSalary, statusBadgeClass, getLogoDomain } from '../../utils/helpers.js'

// PRD: JobCard — shows company logo, name, role, status, applied date, salary
// Actions: Edit, Delete, Bookmark
export default function JobCard({ app }) {
  const { deleteApplication, toggleBookmark } = useAppCtx()
  const [imgErr, setImgErr] = useState(false)

  function handleDelete() {
    if (window.confirm(`Delete application for ${app.role} at ${app.company}?`)) {
      deleteApplication(app.id)
      toast.success('Deleted successfully')
    }
  }

  function handleBookmark() {
    toggleBookmark(app.id)
    toast.success(app.bookmarked ? 'Removed from bookmarks' : 'Bookmarked!')
  }

  const initials = app.company.slice(0, 2).toUpperCase()
  const logo = getLogoUrl(getLogoDomain(app.company))

  return (
    <div className="job-card fade-up">
      {/* Header: Logo + Title + Actions */}
      <div className="jc-header">
        {!imgErr
          ? <img src={logo} alt={app.company} className="company-logo" onError={() => setImgErr(true)} />
          : <div className="company-initials">{initials}</div>
        }

        <div className="jc-title">
          <div className="jc-role">{app.role}</div>
          <div className="jc-company">{app.company}</div>
        </div>

        <div className="jc-actions">
          {/* PRD: Bookmark */}
          <button
            className={`btn btn-icon btn-ghost ${app.bookmarked ? 'bookmark-active' : ''}`}
            onClick={handleBookmark}
            title={app.bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {app.bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
          </button>
          {/* PRD: Edit */}
          <Link to={`/applications/${app.id}`} className="btn btn-icon btn-ghost" title="Edit">
            <MdEdit />
          </Link>
          {/* PRD: Delete */}
          <button className="btn btn-icon btn-danger" onClick={handleDelete} title="Delete">
            <MdDelete />
          </button>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
        <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
        {app.locationType && (
          <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', textTransform: 'capitalize' }}>
            {app.locationType}
          </span>
        )}
      </div>

      {/* Meta info */}
      <div className="jc-meta">
        <span className="meta-chip"><MdLocationOn size={13} />{app.location || '—'}</span>
        <span className="meta-chip"><MdCalendarToday size={13} />{formatDate(app.appliedDate)}</span>
        <span className="meta-chip"><MdAttachMoney size={13} />{formatSalary(app.salary)}</span>
        <span className="meta-chip"><MdWork size={13} />{app.platform || '—'}</span>
      </div>

      {/* Interview date if scheduled */}
      {app.interviewDate && (
        <div className="jc-interview">
          📅 Interview: {formatDate(app.interviewDate)}
        </div>
      )}
    </div>
  )
}
