import React, { useState } from 'react'
import '../../styles/CMS/Settings.css'

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'TELMI',
    siteDescription: 'Penyedia Jasa Telekomunikasi Terpercaya',
    email: 'telmibgt@gmail.com',
    phone: '0889-4456-2334',
    address: 'Depok',
    mlApiUrl: 'https://api.telmi.com/ml',
    enableRecommendations: true,
    enableNotifications: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="cms-settings">
      <div className="page-header">
        <div>
          <h1>Pengaturan</h1>
          <p>Kelola pengaturan sistem dan aplikasi</p>
        </div>
        <button className="btn-primary">Simpan Perubahan</button>
      </div>

      <div className="settings-sections">
        <div className="settings-card">
          <h2>Informasi Umum</h2>
          <div className="form-group">
            <label>Nama Situs</label>
            <input 
              type="text" 
              name="siteName" 
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Deskripsi Situs</label>
            <textarea 
              name="siteDescription" 
              value={settings.siteDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="settings-card">
          <h2>Kontak</h2>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={settings.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>No. Telepon</label>
            <input 
              type="tel" 
              name="phone" 
              value={settings.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Alamat</label>
            <input 
              type="text" 
              name="address" 
              value={settings.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-card">
          <h2>API & Integrasi</h2>
          <div className="form-group">
            <label>ML API URL</label>
            <input 
              type="url" 
              name="mlApiUrl" 
              value={settings.mlApiUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-card">
          <h2>Fitur</h2>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="enableRecommendations" 
                checked={settings.enableRecommendations}
                onChange={handleChange}
              />
              <span>Aktifkan Rekomendasi Otomatis</span>
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="enableNotifications" 
                checked={settings.enableNotifications}
                onChange={handleChange}
              />
              <span>Aktifkan Notifikasi</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings



