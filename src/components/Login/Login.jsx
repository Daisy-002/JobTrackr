import React, { useState } from 'react'
import { useAppCtx } from '../../context/ApplicationContext.jsx'
import './Login.css'

export default function Login() {
  const { userName, setUserName } = useAppCtx()
  const [inputValue, setInputValue] = useState('')
  const [showLogin, setShowLogin] = useState(!userName)

  function handleSubmit(e) {
    e.preventDefault()
    if (inputValue.trim()) {
      setUserName(inputValue.trim())
      setShowLogin(false)
    }
  }

  function handleLogout() {
    setUserName('')
    setShowLogin(true)
    setInputValue('')
  }

  if (!showLogin) return null

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-icon">💼</div>
        <h2>Welcome to JobTrackr</h2>
        <p>Please enter your name to get started</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Enter your name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <button type="submit" className="login-btn">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
