import React, { useState, useEffect } from 'react'
import { Play, Zap, Lightbulb, TrendingUp, Save, Check, Calendar, Clock, Trash2 } from 'lucide-react'
import { saveProductSimulation, getProductSimulations, deleteProductSimulation, simulateProductImpact } from '../../services/api'
import ConfirmDialog from '../../components/ConfirmDialog'

const ProductLab = () => {
  const [simulating, setSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [simulations, setSimulations] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [dateFilter, setDateFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' })

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    duration: '',
    dataCapacity: '',
    minutes: '',
    sms: '',
    vodCapacity: ''
  })

  // Fetch simulations history
  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        setLoadingHistory(true)
        const filters = dateFilter ? { date: dateFilter } : {}
        const data = await getProductSimulations(filters)
        setSimulations(data)
      } catch (error) {
        console.error('Error fetching simulations:', error)
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchSimulations()
  }, [dateFilter])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSimulate = async () => {
    // Validation
    if (!formData.productName || !formData.category || !formData.price) {
      alert('Mohon lengkapi Nama Produk, Kategori, dan Harga')
      return
    }

    // Price validation (harus angka positif)
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      alert('Harga harus berupa angka positif')
      return
    }

    setSimulating(true)
    try {
      console.log('Sending simulation request to backend...', formData)
      
      // Call ML-based backend simulation (menggunakan global analytics)
      // Backend akan fetch semua 10k user dan check kategori match + budget
      const backendResult = await simulateProductImpact(formData)
      
      console.log('Backend response:', backendResult)
      
      // Transform segments to targetUsers format (grouping by target_offer label)
      const targetUsers = backendResult.segments && Object.keys(backendResult.segments).length > 0
        ? Object.entries(backendResult.segments)
            .map(([segment, count]) => ({
              segment,
              count,
              percentage: backendResult.hits > 0 ? ((count / backendResult.hits) * 100).toFixed(1) : '0'
            }))
            .sort((a, b) => b.count - a.count)
        : []

      // Calculate match score dari conversion rate (0-100)
      const matchScore = Math.min(backendResult.conversion_rate * 4, 100)
      
      const result = {
        hits: backendResult.hits,
        revenue: backendResult.revenue,
        matchScore: matchScore.toFixed(1),
        conversionRate: backendResult.conversion_rate.toFixed(2),
        priceSegment: price < 100000 ? 'Budget Friendly' : price < 200000 ? 'Mid Range' : 'Premium',
        targetUsers: targetUsers.length > 0 ? targetUsers : [],
        recommendation: backendResult.recommendation,
        totalAnalyzed: backendResult.total_users || 0
      }

      setSimulationResult(result)
      setSaved(false)
    } catch (error) {
      console.error('Simulation error:', error)
      alert('Gagal melakukan simulasi. Pastikan backend service berjalan di http://localhost:8000')
    } finally {
      setSimulating(false)
    }
  }

  const handleSaveSimulation = async () => {
    if (!simulationResult) return

    setSaving(true)
    try {
      const simulationData = {
        ...formData,
        ...simulationResult
      }

      const saved = await saveProductSimulation(simulationData)
      if (saved) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000) // Reset after 3 seconds
        // Refresh history
        const data = await getProductSimulations()
        setSimulations(data)
      }
    } catch (error) {
      console.error('Error saving simulation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ isOpen: true, id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return

    try {
      const success = await deleteProductSimulation(deleteConfirm.id)
      if (success) {
        // Refresh history
        const data = await getProductSimulations()
        setSimulations(data)
      }
    } catch (error) {
      console.error('Error deleting simulation:', error)
    }
  }

  // Use simulations directly (already filtered by API)
  const filteredSimulations = simulations

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-lg shadow-purple-500/30">
          <Zap size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Lab</h1>
          <p className="mt-1 text-slate-400">Simulasi AI untuk analisis peluang pasar produk baru</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-white tracking-tight">Konfigurasi Produk</h2>

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nama Produk</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleFormChange}
                placeholder="e.g., Super Gamer 50GB"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              >
                <option value="">Pilih Category</option>
                <option value="Data">Data</option>
                <option value="Combo">Combo</option>
                <option value="VOD">VOD</option>
                <option value="Roaming">Roaming</option>
                <option value="DeviceBundle">Device Bundle</option>
                <option value="Voice">Voice</option>
              </select>
            </div>

            {/* Price & Duration */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Harga (Rp)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="50000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Durasi (Hari)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  placeholder="30"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Detail Kuota */}
            <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
              <h3 className="mb-4 font-semibold text-white">Detail Kuota</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data (GB)</label>
                  <input
                    type="number"
                    name="dataCapacity"
                    value={formData.dataCapacity}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Panggilan (Menit)</label>
                  <input
                    type="number"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">SMS</label>
                  <input
                    type="number"
                    name="sms"
                    value={formData.sms}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">VOD (GB)</label>
                  <input
                    type="number"
                    name="vodCapacity"
                    value={formData.vodCapacity}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Run Simulation Button */}
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-white font-semibold transition hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {simulating ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Jalankan Simulasi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
          <div className="mb-4 flex items-start gap-3">
            <Lightbulb className="mt-1 text-cyan-400" size={24} />
            <div>
              <h3 className="font-bold text-white">Tentang Product Lab</h3>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Product Lab menggunakan AI untuk menganalisis peluang pasar produk baru Anda. 
            Sistem akan mengevaluasi harga, kategori, dan detail kuota untuk memberikan 
            rekomendasi dan prediksi performa produk di pasar.
          </p>
        </div>
      </div>

      {/* Results Section */}
      {simulationResult && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg animate-fade-in-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Hasil Simulasi</h2>
            <p className="mt-2 text-sm text-slate-400">
              Dianalisis dari <span className="font-semibold text-cyan-400">{simulationResult.totalAnalyzed?.toLocaleString() || 'semua'}</span> pelanggan total
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[
              { label: 'Match Score', value: `${simulationResult.matchScore}%`, icon: TrendingUp, color: 'from-cyan-500 to-blue-600' },
              { label: 'Target Users', value: simulationResult.hits, sublabel: 'matched customers', color: 'from-emerald-500 to-green-600' },
              { label: 'Conversion Rate', value: `${simulationResult.conversionRate}%`, sublabel: 'dari total customer', color: 'from-purple-500 to-pink-600' },
              { label: 'Revenue Potensial', value: `Rp ${(simulationResult.revenue / 1000000).toFixed(1)}jt`, sublabel: 'estimasi', color: 'from-amber-500 to-orange-600' }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 hover:bg-slate-800 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">{item.label}</p>
                    <p className={`mt-2 text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.value}
                    </p>
                    {item.sublabel && <p className="mt-1 text-xs text-slate-500">{item.sublabel}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Target Segments */}
          <div className="mb-8">
            <h3 className="mb-4 font-bold text-white">Target User Segments (ML Prediction)</h3>
            <div className="space-y-3">
              {simulationResult.targetUsers && simulationResult.targetUsers.length > 0 ? (
                simulationResult.targetUsers.map((target, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">{target.segment}</span>
                      <span className="text-sm font-bold text-white">{target.count.toLocaleString()} users ({target.percentage}%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${target.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="text-sm text-amber-200">
                    <strong>Tidak ada user yang cocok.</strong> Kemungkinan penyebab:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-100">
                    <li>• Harga produk ({simulationResult.priceSegment}) terlalu mahal untuk kategori '<strong>{formData.category}</strong>'</li>
                    <li>• Tidak ada user dengan kategori prediksi yang sesuai dengan kategori produk</li>
                    <li>• Pertimbangkan menurunkan harga atau memilih kategori lain</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 text-amber-400" size={24} />
              <div>
                <h4 className="font-bold text-white">Rekomendasi</h4>
                <p className="mt-1 text-sm text-slate-300">
                  {simulationResult.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSimulation}
              disabled={saving || saved}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-white font-semibold transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Menyimpan...</span>
                </>
              ) : saved ? (
                <>
                  <Check size={18} />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Simpan Hasil Simulasi</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">History Simulasi</h2>
            <p className="mt-1 text-sm text-slate-400">Riwayat hasil simulasi yang sudah disimpan</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              />
            </div>
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
              <p className="text-slate-400">Memuat history...</p>
            </div>
          </div>
        ) : filteredSimulations.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto mb-4 text-slate-500" size={48} />
            <p className="text-slate-400">
              {dateFilter ? 'Tidak ada simulasi pada tanggal yang dipilih' : 'Belum ada history simulasi'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSimulations.map((sim) => (
              <div
                key={sim.id}
                className="rounded-xl border border-slate-800 bg-slate-800/50 p-5 hover:bg-slate-800 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 animate-fade-in-up"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate mb-1">{sim.productName || 'Unnamed Product'}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 text-xs font-semibold text-purple-400">
                        {sim.category || 'N/A'}
                      </span>
                      <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-400">
                        {sim.priceSegment || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(sim.id, sim.productName || 'simulasi ini')}
                    className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Match Score</span>
                    <span className={`text-sm font-bold ${
                      sim.matchScore >= 80 ? 'text-emerald-400' :
                      sim.matchScore >= 60 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {sim.matchScore?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Estimasi Pengguna</span>
                    <span className="text-sm font-semibold text-white">{sim.estimatedRecommendations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Conversion Rate</span>
                    <span className="text-sm font-semibold text-white">{sim.conversionRate?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Harga</span>
                    <span className="text-sm font-semibold text-white">Rp {(sim.price || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>{formatDate(sim.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Hapus Simulasi"
        message={`Apakah Anda yakin ingin menghapus simulasi "${deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default ProductLab
