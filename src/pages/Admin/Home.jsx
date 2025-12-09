import React, { useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)
import { Users, Package, AlertTriangle, Sparkles } from 'lucide-react'
import { getDashboardStats, getChurnComposition } from '../../services/api'

const Home = () => {
  const [stats, setStats] = useState(null)
  const [churnComposition, setChurnComposition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch both dashboard stats and churn composition in parallel
        const [dashboardData, churnData] = await Promise.all([
          getDashboardStats(),
          getChurnComposition()
        ])
        
        setStats(dashboardData)
        setChurnComposition(churnData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
          <p className="text-slate-400">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">{error || 'Error memuat statistik'}</p>
      </div>
    )
  }

  const quickStats = [
    {
      label: 'Total Produk',
      value: stats.totalPackages || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      change: '+2.5%',
      changeColor: 'text-emerald-400'
    },
    {
      label: 'Total Pelanggan',
      value: (stats.totalCustomers || 0).toLocaleString(),
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      change: '+8.3%',
      changeColor: 'text-emerald-400'
    },
    {
      label: 'Alert Churn',
      value: (churnComposition?.churn_rate?.toFixed(1) || 0) + '%',
      icon: AlertTriangle,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      change: 'Perlu perhatian',
      changeColor: 'text-amber-400'
    },
  ]

  // Prepare pie chart data dari churn composition API
  const pieData = {
    labels: [
      `🔴 Tinggi (${churnComposition?.composition?.high?.count || 0} user)`,
      `🟡 Sedang (${churnComposition?.composition?.medium?.count || 0} user)`,
      `🟢 Rendah (${churnComposition?.composition?.low?.count || 0} user)`
    ],
    datasets: [
      {
        label: 'Tingkat Risiko Churn',
        data: [
          churnComposition?.composition?.high?.percentage || 0,
          churnComposition?.composition?.medium?.percentage || 0,
          churnComposition?.composition?.low?.percentage || 0
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: '#0f1727',
        borderWidth: 3,
      },
    ],
  }

  return (
    <div className="w-full space-y-4 md:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 lg:p-8 text-white shadow-xl border border-slate-700/50 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="inline-flex p-2.5 md:p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
            <p className="mt-1.5 md:mt-2 text-slate-300 text-sm md:text-base">Selamat datang di dashboard analitik Telvora</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${200 + idx * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`rounded-xl ${stat.bgColor} p-3 ${stat.iconColor} animate-float-soft flex-shrink-0`}>
                  <Icon size={32} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-1">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
                  <span className={`text-sm font-semibold ${stat.changeColor}`}>{stat.change}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${stat.changeColor}`}>{stat.change}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Churn Composition Info */}
      {churnComposition && (
        <div className="grid gap-4 md:gap-6">
          {/* Pie Chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <div className="inline-flex p-1.5 sm:p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">Komposisi Risiko Churn</h2>
            </div>
            <div className="relative w-full h-64 sm:h-72 md:h-80">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        color: '#e2e8f0',
                        font: {
                          size: 12,
                          weight: '500',
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      titleColor: '#fff',
                      bodyColor: '#e2e8f0',
                      borderColor: '#334155',
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8,
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.parsed}%`
                        }
                      }
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home






