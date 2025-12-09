import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react'
import { getAnalytics } from '../../services/api'

const Analytic = () => {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data = await getAnalytics()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading || !analyticsData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
          <p className="text-slate-400">Memuat analytics...</p>
        </div>
      </div>
    )
  }

  const totalUsers = analyticsData?.total_users || 0
    const modelPerf = analyticsData?.model_performance || {}
  const modelAccuracy = modelPerf?.accuracy ?? null
  const highData = analyticsData?.high_data || {}
  const planSpend = analyticsData?.plan_spend || {}
  const planCounts = analyticsData?.plan_counts || {}
  const videoVoice = analyticsData?.video_voice || {}
  const topProducts = analyticsData?.top_products || []

  const pctVideo = totalUsers ? ((videoVoice.video_lovers || 0) / totalUsers * 100).toFixed(1) : '0.0'
  const pctVoice = totalUsers ? ((videoVoice.voice_lovers || 0) / totalUsers * 100).toFixed(1) : '0.0'
  const pctBalanced = totalUsers ? ((videoVoice.balanced || 0) / totalUsers * 100).toFixed(1) : '0.0'
  const pctPostpaid = totalUsers ? ((planCounts.Postpaid || 0) / totalUsers * 100).toFixed(1) : '0.0'
  const pctPrepaid = totalUsers ? ((planCounts.Prepaid || 0) / totalUsers * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
        <p className="mt-1 text-slate-400">Analisis behaviour trends dan efektivitas produk</p>
            {/* Model Performance - Sesuai Notebook Cell 9 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">📊 Kinerja Model Rekomendasi</h2>
                <p className="mt-1 text-sm text-slate-400">Evaluasi performa model machine learning dalam memprediksi target offer</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Accuracy Card */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 hover:bg-emerald-500/15 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-3">
                      <TrendingUp className="text-emerald-400" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Model Accuracy</p>
                      <p className="text-3xl font-bold text-white">{modelAccuracy !== null ? `${modelAccuracy}%` : 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Akurasi model Random Forest pada {totalUsers.toLocaleString()} pelanggan
                  </p>
                </div>

                {/* Total Classes Card */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6 hover:bg-cyan-500/15 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-3">
                      <Package className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Classes</p>
                      <p className="text-3xl font-bold text-white">{modelPerf.total_classes || 0}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Jumlah kategori target offer yang diprediksi model
                  </p>
                </div>

                {/* Model Info Card */}
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 hover:bg-purple-500/15 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-purple-500/20 border border-purple-500/30 p-3">
                      <BarChart3 className="text-purple-400" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Model Type</p>
                      <p className="text-xl font-bold text-white">Random Forest</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Multi-class classification untuk prediksi target offer
                  </p>
                </div>
              </div>

              {/* Model Classes Info */}
              {modelPerf.classes && modelPerf.classes.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-bold text-white tracking-tight">Target Offer Classes</h3>
                  <div className="flex flex-wrap gap-2">
                    {modelPerf.classes.map((className, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300"
                      >
                        {className}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    ℹ️ Model dilatih untuk memprediksi {modelPerf.total_classes} kategori target offer berdasarkan perilaku pelanggan
                  </p>
                </div>
              )}
            </div>

      </div>

      {/* Behaviour Highlights - Sesuai Notebook Cell 10 */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">📈 Behaviour Highlights</h2>
          <p className="mt-1 text-sm text-slate-400">Analisis perilaku pelanggan berdasarkan data usage, plan type, dan preferensi konten</p>
        </div>

        {/* 1. HIGH DATA USERS */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-white tracking-tight">📊 Data Usage Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Threshold 'High Data User'</span>
              <span className="text-lg font-bold text-white">
                {highData.threshold ? `${highData.threshold.toFixed(2)} GB` : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              (max(10GB, Q3={highData.q75_usage ? highData.q75_usage.toFixed(2) : 'N/A'}GB))
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <span className="text-sm text-slate-400">High Data Users</span>
              <span className="text-2xl font-bold text-cyan-400">
                {highData.count?.toLocaleString() || 0} <span className="text-sm text-slate-400">({highData.percentage || 0}%)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">dari {totalUsers.toLocaleString()} total users</p>
          </div>
        </div>

        {/* 2. MONTHLY SPEND PER PLAN TYPE */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-white tracking-tight">💰 Monthly Spend Trends (Per Plan Type)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Postpaid</p>
              <p className="text-2xl font-bold text-cyan-400">
                Rp {planSpend.Postpaid?.toLocaleString?.('id-ID') || planSpend.Postpaid?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {planCounts.Postpaid?.toLocaleString() || 0} users ({pctPostpaid}%)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Prepaid</p>
              <p className="text-2xl font-bold text-amber-400">
                Rp {planSpend.Prepaid?.toLocaleString?.('id-ID') || planSpend.Prepaid?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {planCounts.Prepaid?.toLocaleString() || 0} users ({pctPrepaid}%)
              </p>
            </div>
          </div>
        </div>

        {/* 3. VIDEO vs VOICE vs BALANCED */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-white tracking-tight">🎧 Video vs Voice Behaviour</h3>
          <p className="text-xs text-slate-500 mb-4">
            Median Call Duration: {videoVoice.median_call?.toFixed ? videoVoice.median_call.toFixed(1) : videoVoice.median_call || 0} menit
          </p>
          <div className="space-y-4">
            {[ 
              { 
                label: 'Video Lovers', 
                desc: '(≥60% waktu di video)',
                value: pctVideo, 
                count: videoVoice.video_lovers || 0, 
                color: 'bg-red-500' 
              },
              { 
                label: 'Voice Lovers', 
                desc: '(video ≤40%, call ≥ median)',
                value: pctVoice, 
                count: videoVoice.voice_lovers || 0, 
                color: 'bg-blue-500' 
              },
              { 
                label: 'Balanced Users', 
                desc: '(tidak masuk kategori lainnya)',
                value: pctBalanced, 
                count: videoVoice.balanced || 0, 
                color: 'bg-emerald-500' 
              }
            ].map((item, idx) => (
              <div key={item.label} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <span className="text-xs text-slate-500 ml-2">{item.desc}</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {item.count.toLocaleString()} ({item.value}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Effectiveness - Sesuai Notebook Cell 11 */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">🎁 Product Effectiveness (Top 10 Recommended)</h2>
          <p className="mt-1 text-sm text-slate-400">Produk yang paling sering direkomendasikan oleh model ML</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="mb-6 text-lg font-bold text-white tracking-tight">🏆 Top 10 Produk Paling Sering Direkomendasikan</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product, idx) => (
              <div key={product.product_name + idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                    <span className="text-sm font-medium text-slate-300">{product.product_name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{product.count.toLocaleString()}x ({product.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-400">Sedang menghitung rekomendasi...</p>
                <p className="text-xs text-slate-500 mt-2">Proses ini membutuhkan waktu untuk {totalUsers.toLocaleString()} users</p>
              </div>
            )}
          </div>
          
          {topProducts.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400">
                ℹ️ Top 10 dihitung dari seluruh rekomendasi model untuk {totalUsers.toLocaleString()} user. 
                Persentase mencerminkan porsi kemunculan produk di daftar rekomendasi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytic
