import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MdArrowBack, MdSave, MdOpenInNew } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import { STATUS_LIST, PLATFORM_LIST, LOCATION_TYPES } from '../../utils/helpers.js'
import { fetchMockJobs } from '../../services/api.js'

const schema = yup.object({
  company:       yup.string().required('Company name is required'),
  role:          yup.string().required('Job role is required'),
  appliedDate:   yup.string().required('Applied date is required'),
  location:      yup.string(),
  locationType:  yup.string(),
  salary:        yup.number().typeError('Must be a number').nullable(true).transform(v => isNaN(v) ? null : v),
  platform:      yup.string(),
  status:        yup.string(),
  interviewDate: yup.string(),
  notes:         yup.string(),
})

export default function AddApplication() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const { addApplication, updateApplication, getById } = useAppCtx()

  // Job suggestions from dummyjson API
  const [mockJobs, setMockJobs]   = useState([])
  const [loadingJobs, setLoading] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company: '', role: '', location: '',
      locationType: 'onsite', salary: '',
      platform: 'LinkedIn', status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      interviewDate: '', notes: '',
    },
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit) {
      const app = getById(id)
      if (app) reset({ ...app, salary: app.salary || '' })
      else { toast.error('Not found'); navigate('/applications') }
    }
  }, [id])

  // Fetch mock job suggestions on mount (only for Add mode)
  useEffect(() => {
    if (!isEdit) {
      setLoading(true)
      fetchMockJobs()
        .then(data => setMockJobs(data.slice(0, 6)))
        .catch(err => console.error('API error:', err))
        .finally(() => setLoading(false))
    }
  }, [isEdit])

  function onSubmit(data) {
    if (isEdit) {
      updateApplication(id, data)
      toast.success('Updated!')
    } else {
      addApplication(data)
      toast.success('Application added!')
    }
    navigate('/applications')
  }

  // Click a suggestion to auto-fill company + role
  function applySuggestion(job) {
    setValue('role', job.title)
    setValue('company', job.brand || '')
    toast.success(`Filled in: ${job.title}`)
  }

  return (
    <div className="fade-up">
      <div className="flex-center gap-3 page-head">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          <MdArrowBack />
        </button>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Application' : 'Add New Job'}</h1>
          <p className="page-sub">{isEdit ? 'Update application details' : 'Track a new job application'}</p>
        </div>
      </div>

      <div className="add-layout">
        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-page" style={{ flex: 1 }}>

          <div className="form-card">
            <div className="form-card-title">Job Details</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" placeholder="e.g. Google" {...register('company')} />
                {errors.company && <span className="form-error">{errors.company.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Job Role *</label>
                <input className="form-input" placeholder="e.g. Frontend Developer" {...register('role')} />
                {errors.role && <span className="form-error">{errors.role.message}</span>}
              </div>
            </div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Bangalore" {...register('location')} />
              </div>
              <div className="form-group">
                <label className="form-label">Location Type</label>
                <select className="form-select" {...register('locationType')}>
                  {LOCATION_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Salary (₹ / year)</label>
                <input className="form-input" type="number" placeholder="e.g. 1200000" {...register('salary')} />
                {errors.salary && <span className="form-error">{errors.salary.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Platform</label>
                <select className="form-select" {...register('platform')}>
                  {PLATFORM_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Status & Dates</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" {...register('status')}>
                  {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Applied Date *</label>
                <input className="form-input" type="date" {...register('appliedDate')} />
                {errors.appliedDate && <span className="form-error">{errors.appliedDate.message}</span>}
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 280 }}>
              <label className="form-label">Interview Date (optional)</label>
              <input className="form-input" type="date" {...register('interviewDate')} />
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Notes</div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Referral details, recruiter name, tips..."
                {...register('notes')}
              />
            </div>
          </div>

          <div className="flex-center gap-3 mt-4">
            <button type="submit" className="btn btn-primary">
              <MdSave size={16} /> {isEdit ? 'Save Changes' : 'Add Application'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/applications')}>
              Cancel
            </button>
          </div>
        </form>

        {/* ── Right: Job Suggestions (only on Add mode) ── */}
        {!isEdit && (
          <div className="suggestions-panel">
            <div className="card" style={{ position: 'sticky', top: 0 }}>
              <div className="card-title">
                💡 Job Suggestions
                <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 400, marginLeft: 6 }}>via DummyJSON API</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
                Click any suggestion to auto-fill the form
              </p>

              {loadingJobs ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {mockJobs.map(job => (
                    <div
                      key={job.id}
                      className="suggestion-card"
                      onClick={() => applySuggestion(job)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{job.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{job.brand} · {job.category}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>${job.price}/hr</div>
                        <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>Click to fill ↗</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .add-layout {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .suggestions-panel {
          width: 280px;
          flex-shrink: 0;
        }

        .suggestion-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius3);
          cursor: pointer;
          transition: all 0.15s;
        }

        .suggestion-card:hover {
          background: var(--accent-light);
          border-color: var(--accent);
          transform: translateX(2px);
        }

        @media (max-width: 900px) {
          .add-layout { flex-direction: column; }
          .suggestions-panel { width: 100%; }
        }
      `}</style>
    </div>
  )
}
