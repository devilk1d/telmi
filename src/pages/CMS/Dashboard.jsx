import React from 'react'
import '../../styles/CMS/Dashboard.css'

const Dashboard = () => {
  const stats = [
    { label: 'Total Pelanggan', value: '12,543', icon: '👥', color: '#0066cc' },
    { label: 'Paket Aktif', value: '8,234', icon: '📦', color: '#00c853' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 2.4M', icon: '💰', color: '#ffc107' },
    { label: 'Rekomendasi Diterima', value: '1,234', icon: '⭐', color: '#e91e63' }
  ]

  const recentActivities = [
    { id: 1, type: 'Paket Baru', description: 'Paket Premium+ ditambahkan', time: '2 jam lalu' },
    { id: 2, type: 'Pelanggan', description: 'Budi Santoso mendaftar', time: '5 jam lalu' },
    { id: 3, type: 'Rekomendasi', description: '150 rekomendasi baru dibuat', time: '1 hari lalu' },
    { id: 4, type: 'Pembayaran', description: 'Pembayaran paket Unlimited+', time: '2 hari lalu' }
  ]

  return (
    <div className="cms-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <span style={{ fontSize: '32px' }}>{stat.icon}</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Aktivitas Terkini</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <span>📋</span>
                </div>
                <div className="activity-content">
                  <h4>{activity.type}</h4>
                  <p>{activity.description}</p>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Grafik Pendapatan</h2>
          <div className="chart-placeholder">
            <p>Grafik akan ditampilkan di sini</p>
            <div className="chart-bars">
              {[65, 80, 45, 90, 70, 85].map((height, index) => (
                <div key={index} className="chart-bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



