import { useState } from 'react'
import { useDebounce } from './useDebounce.js'

// PRD: useApplications hook - handles search, filter, sort logic
export function useApplications(applications) {
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [platformFilter, setPlatform]   = useState('All')
  const [locFilter, setLocFilter]       = useState('All')
  const [sortBy, setSortBy]             = useState('appliedDate')
  const [sortDir, setSortDir]           = useState('desc')
  const [activeTab, setActiveTab]       = useState('All')

  // PRD: debounce search
  const debouncedSearch = useDebounce(search, 500)

  const filtered = applications.filter(app => {
    const q = debouncedSearch.toLowerCase()
    const matchSearch = !q ||
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q)

    const matchTab =
      activeTab === 'All' ||
      (activeTab === 'Bookmarked' && app.bookmarked) ||
      app.status === activeTab

    const matchStatus   = statusFilter === 'All' || app.status === statusFilter
    const matchPlatform = platformFilter === 'All' || app.platform === platformFilter
    const matchLoc      = locFilter === 'All' || app.locationType === locFilter

    return matchSearch && matchTab && matchStatus && matchPlatform && matchLoc
  })

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortBy], vb = b[sortBy]
    if (sortBy === 'appliedDate' || sortBy === 'interviewDate') {
      va = va ? new Date(va).getTime() : 0
      vb = vb ? new Date(vb).getTime() : 0
    } else if (sortBy === 'salary') {
      va = Number(va) || 0
      vb = Number(vb) || 0
    } else {
      va = (va || '').toLowerCase()
      vb = (vb || '').toLowerCase()
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function handleSort(field) {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const uniquePlatforms = [...new Set(applications.map(a => a.platform).filter(Boolean))]

  return {
    filtered: sorted,
    search, setSearch,
    statusFilter, setStatusFilter,
    platformFilter, setPlatform,
    locFilter, setLocFilter,
    sortBy, sortDir, handleSort,
    activeTab, setActiveTab,
    uniquePlatforms,
  }
}
