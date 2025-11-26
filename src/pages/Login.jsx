import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured, isValidUrl, isJwt, isWrongKeyPrefix } from '../lib/supabaseClient'
import '../styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.message || 'Gagal login'
      if (!isSupabaseConfigured) {
        if (isWrongKeyPrefix) {
          setError('Key bukan Supabase Anon. Jangan pakai sb_publishable/sb_secret; gunakan Anon public key (JWT mulai eyJ...).')
        } else if (!isValidUrl) {
          setError('VITE_SUPABASE_URL tidak valid. Gunakan https://<project-ref>.supabase.co.')
        } else if (!isJwt) {
          setError('VITE_SUPABASE_ANON_KEY harus JWT (mulai eyJ..., berisi titik).')
        } else {
          setError('Konfigurasi Supabase belum diatur dengan benar.')
        }
      } else if (msg === 'Failed to fetch') {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174'
        setError(`Tidak bisa terhubung ke Supabase. Periksa URL/Key, koneksi internet, dan whitelist ${origin} di Auth settings.`)
      } else {
        setError(msg)
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Illustration */}
        <div className="login-left">
          {/* Logo Telvora */}
          <div className="logo-container">
            <div className="logo-telvora">
              <svg className="logo-orbit" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Orbit ring dengan glow effect */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="url(#glowGradient)" strokeWidth="3" opacity="0.6">
                  <animate attributeName="stroke-width" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                </circle>
                
                {/* Inner glow circle */}
                <circle cx="100" cy="100" r="50" fill="url(#centerGlow)" opacity="0.8">
                  <animate attributeName="r" values="50;55;50" dur="2s" repeatCount="indefinite"/>
                </circle>
                
                {/* Center circle */}
                <circle cx="100" cy="100" r="35" fill="#00ffcc" opacity="0.9"/>
                <circle cx="100" cy="100" r="25" fill="#1a5f4a" opacity="0.3"/>
                
                {/* Orbit path */}
                <path d="M 30,100 Q 100,30 170,100 Q 100,170 30,100" fill="none" stroke="rgba(0, 255, 204, 0.3)" strokeWidth="2"/>
                
                {/* Gradients */}
                <defs>
                  <radialGradient id="glowGradient">
                    <stop offset="0%" stopColor="#00ffcc"/>
                    <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.3"/>
                  </radialGradient>
                  <radialGradient id="centerGlow">
                    <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.1"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <h1 className="brand-name">TELVORA</h1>
            <p className="brand-tagline">DATA. PROCESSED. CLARITY.</p>
            <p className="brand-motto">NEUTER ROGLAR EAEZAEA</p>
          </div>

          {/* Network Grid Effect */}
          <div className="network-grid">
            <div className="grid-line grid-line-1"></div>
            <div className="grid-line grid-line-2"></div>
            <div className="grid-line grid-line-3"></div>
            <div className="grid-line grid-line-4"></div>
          </div>

          {/* Data Particles */}
          <div className="particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
          </div>

          {/* Signal Waves */}
          <div className="signal-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>

          {/* Decorative Tech Elements */}
          <div className="tech-circles">
            <div className="tech-circle tech-circle-1"></div>
            <div className="tech-circle tech-circle-2"></div>
            <div className="tech-circle tech-circle-3"></div>
            <div className="tech-circle tech-circle-4"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-header">
              <h2 className="login-title">ADMIN LOGIN</h2>
              <p className="login-desc">Access Telvora Analytics Portal</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-login">
                <span>Sign In</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div className="form-footer">
                <p> <a href="#" className="create">Gunakan akun admin atau pengguna untuk akses ke dashboard. Sesi dikelola oleh Supabase Auth.</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login