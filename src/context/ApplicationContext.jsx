import React, { createContext, useContext, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const Ctx = createContext(null)

// PRD: ApplicationContext with applications, addApplication, deleteApplication, updateApplication
export function ApplicationProvider({ children }) {
  // PRD: useLocalStorage to persist data
  const [applications, setApplications] = useLocalStorage('jt_apps', [])
  const [userName, setUserName] = useLocalStorage('jt_user_name', '')

  function addApplication(data) {
    const newApp = { ...data, id: uuid(), bookmarked: false }
    setApplications([newApp, ...applications])
    return newApp
  }

  function updateApplication(id, data) {
    setApplications(applications.map(a => a.id === id ? { ...a, ...data } : a))
  }

  function deleteApplication(id) {
    setApplications(applications.filter(a => a.id !== id))
  }

  function toggleBookmark(id) {
    setApplications(applications.map(a =>
      a.id === id ? { ...a, bookmarked: !a.bookmarked } : a
    ))
  }

  function getById(id) {
    return applications.find(a => a.id === id)
  }

  return (
    <Ctx.Provider value={{
      applications,
      addApplication,
      updateApplication,
      deleteApplication,
      toggleBookmark,
      getById,
      userName,
      setUserName,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAppCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppCtx must be inside ApplicationProvider')
  return ctx
}
