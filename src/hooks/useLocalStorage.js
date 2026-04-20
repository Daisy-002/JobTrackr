import { useState } from 'react'

// PRD: useLocalStorage hook
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  function set(newVal) {
    setValue(newVal)
    try { localStorage.setItem(key, JSON.stringify(newVal)) }
    catch (e) { console.error('localStorage error', e) }
  }

  return [value, set]
}
