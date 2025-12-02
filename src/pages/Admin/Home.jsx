import React, { useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import '../../styles/Admin/Home.css'
import { getDashboardStats } from '../../services/api'

const Home = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="cms-dashboard"><p>Loading...</p></div>
  if (!stats) return <div className="cms-dashboard"><p>Error loading stats</p></div>

  const quickStats = [
    { label: 'Total Produk', value: stats.totalPackages || 4, icon: '📦', color: '#3b82f6', change: '+2.5%' },
    { label: 'Total Pengguna', value: (stats.totalCustomers / 1000).toFixed(1) + 'K', icon: '👥', color: '#10b981', change: '+8.3%' },
    { label: 'Alert Churn', value: stats.churnRate?.toFixed(1) || 8.5 + '%', icon: '⚠️', color: '#f59e0b', change: 'Perlu perhatian' },
  ]


  // Data untuk chart lingkaran
  const pieData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Resiko',
        data: [65, 80, 45, 90, 70, 85],
        backgroundColor: [
          '#00ffcc', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#4f46e5'
        ],
        borderColor: '#222',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="cms-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Selamat datang di dashboard analitik</p>
        </div>
      </div>

      {/* Main Content Grid: quick stats vertikal kiri, chart pie kanan */}
      <div className="dashboard-main-grid">
        <div className="dashboard-main-left">
          <div className="quick-stats-vertical">
            {quickStats.map((stat, index) => (
              <div key={index} className="quick-stat-card">
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-details">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                  <span className="stat-change">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-main-right">
          <div className="dashboard-card small">
            <h2>Komposisi Resiko Pelanggan</h2>
            <div style={{ width: 320, height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
              <Pie data={pieData} options={{
                plugins: {
                  legend: {
                    display: true,
                    position: 'right',
                    labels: {
                      color: '#00ffcc',
                      font: { family: 'Rajdhani', size: 14 }
                    }
                  },
                  tooltip: {
                    enabled: true
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home






