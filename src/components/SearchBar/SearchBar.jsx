import React from 'react'
import { MdSearch, MdClose } from 'react-icons/md'

// PRD: Search by company name and role, updates dynamically while typing
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <MdSearch className="search-icon" />
      <input
        className="search-input"
        type="text"
        placeholder="Search by company or role..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          <MdClose />
        </button>
      )}
    </div>
  )
}
