import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ApplicationProvider } from './context/ApplicationContext.jsx'
import Login from './components/Login/Login.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Applications from './pages/Applications/Applications.jsx'
import AddApplication from './pages/AddApplication/AddApplication.jsx'
import Analytics from './pages/Analytics/Analytics.jsx'

// PRD: React Router DOM — all routes
export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Login />
        <div className="app-shell">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/"                   element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"          element={<Dashboard />} />
              <Route path="/applications"       element={<Applications />} />
              <Route path="/applications/new"   element={<AddApplication />} />
              <Route path="/applications/:id"   element={<AddApplication />} />
              <Route path="/analytics"          element={<Analytics />} />
              <Route path="*"                   element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </ApplicationProvider>
  )
}
