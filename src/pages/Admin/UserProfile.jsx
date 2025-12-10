import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getCustomers, getCustomerInsights, createCustomer, deleteCustomer } from '../../services/api'
import { Search, X, AlertTriangle, Sparkles, ChevronRight, Plus, Trash2 } from 'lucide-react'
import ConfirmDialog from '../../components/ConfirmDialog'

const UserProfile = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [insightLoading, setInsightLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [churnInsight, setChurnInsight] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [userCategory, setUserCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' })
  const [formData, setFormData] = useState({
    plan_type: 'Prepaid',
    device_brand: '',
    avg_data_usage_gb: '',
    pct_video_usage: '',
    avg_call_duration: '',
    sms_freq: '',
    monthly_spend: '',
    topup_freq: '',
    travel_score: '',
    complaint_count: '0'
  })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      c.customerId?.toLowerCase().includes(search) ||
      c.planType?.toLowerCase().includes(search) ||
      c.device?.toLowerCase().includes(search)
    )
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, customers, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openAnalysis = (customer) => {
    console.log('Opening analysis for customer:', customer)
    setSelectedCustomer(customer)
    setShowAnalysis(true)
    fetchInsights(customer.customerId || customer.id)
  }

  const closeAnalysis = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowAnalysis(false)
      setSelectedCustomer(null)
      setIsClosing(false)
      setRecommendations([])
      setChurnInsight(null)
      setAiInsights(null)
      setUserCategory('')
    }, 400) // Match animation duration
  }

  const fetchInsights = async (customerId) => {
    if (!customerId) return
    try {
      setInsightLoading(true)
      const data = await getCustomerInsights(customerId)
      setRecommendations(data.recommendations?.items || [])
      setChurnInsight(data.churn || null)
      setAiInsights(data.ai_insights || null)
      setUserCategory(data.user_category || '')
    } catch (error) {
      console.error('Failed to load customer insights', error)
    } finally {
      setInsightLoading(false)
    }
  }

  const generateCustomerId = () => {
    // Find the highest customer ID number
    let maxNum = 0
    customers.forEach(customer => {
      const customerId = customer.customerId || customer.id || ''
      const match = customerId.match(/C(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNum) {
          maxNum = num
        }
      }
    })
    // Generate next customer ID
    const nextNum = maxNum + 1
    return `C${String(nextNum).padStart(5, '0')}`
  }

  const handleAddCustomer = () => {
    setFormData({
      plan_type: 'Prepaid',
      device_brand: '',
      avg_data_usage_gb: '',
      pct_video_usage: '',
      avg_call_duration: '',
      sms_freq: '',
      monthly_spend: '',
      topup_freq: '',
      travel_score: '',
      complaint_count: '0'
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsModalClosing(false)
    }, 400)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveCustomer = async () => {
    try {
      // Auto-generate customer ID
      const customerId = generateCustomerId()

      // Convert form data to database format
      const customerData = {
        customer_id: customerId,
        plan_type: formData.plan_type || null,
        device_brand: formData.device_brand || null,
        avg_data_usage_gb: formData.avg_data_usage_gb ? parseFloat(formData.avg_data_usage_gb) : null,
        pct_video_usage: formData.pct_video_usage ? parseFloat(formData.pct_video_usage) / 100 : null, // Convert percentage to decimal
        avg_call_duration: formData.avg_call_duration ? parseFloat(formData.avg_call_duration) : null,
        sms_freq: formData.sms_freq ? parseInt(formData.sms_freq) : null,
        monthly_spend: formData.monthly_spend ? parseFloat(formData.monthly_spend) : null,
        topup_freq: formData.topup_freq ? parseInt(formData.topup_freq) : null,
        travel_score: formData.travel_score ? parseFloat(formData.travel_score) : null,
        complaint_count: formData.complaint_count ? parseInt(formData.complaint_count) : 0,
        target_offer: null
      }

      await createCustomer(customerData)
      await fetchCustomers()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Gagal menyimpan data pelanggan.')
    }
  }

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ isOpen: true, id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return
    
    try {
      const success = await deleteCustomer(deleteConfirm.id)
      if (success) {
        await fetchCustomers()
      } else {
        alert('Gagal menghapus pelanggan')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Gagal menghapus pelanggan')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' })
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
          <p className="text-slate-400">Memuat data pelanggan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Profile</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Kelola dan analisis data pelanggan</p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <Plus size={18} />
          Tambah Pelanggan
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{customers.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Active customer base</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Across all plans</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg Monthly Spend</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{customers.length > 0 ? `Rp ${(customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0) / customers.length).toLocaleString('id-ID')}` : 'Rp 0'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Average revenue per user</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">ARPU metric</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg Data Usage</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{customers.length > 0 ? `${(customers.reduce((sum, c) => sum + (c.dataUsage || 0), 0) / customers.length).toFixed(1)} GB` : '0 GB'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Per user monthly average</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Data consumption</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Complaints</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{customers.reduce((sum, c) => sum + (c.complaintCount || 0), 0)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Customer service tickets</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">All time count</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari customer ID atau plan type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedCustomers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center text-slate-500 dark:text-slate-400">
            {customers.length === 0 ? 'Memuat data pelanggan...' : 'Tidak ada pelanggan ditemukan'}
          </div>
        ) : (
          paginatedCustomers.map((customer, idx) => (
            <div
              key={customer.id || customer.customerId || idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{customer.customerId || customer.id || 'N/A'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{customer.device || 'N/A'}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => openAnalysis(customer)}
                    className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lg hover:shadow-cyan-500/30"
                  >
                    Analisis
                  </button>
                  <button
                    onClick={() => handleDeleteClick(customer.customerId || customer.id, customer.customerId || customer.id || 'pelanggan ini')}
                    className="rounded-lg bg-red-500/20 border border-red-500/30 p-1.5 text-red-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-red-500/30"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Plan</span>
                  <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-400">
                    {customer.planType || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Data</span>
                  <span className="text-sm text-slate-800 dark:text-slate-300">{(customer.dataUsage || 0).toFixed(1)} GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Top Up Freq</span>
                  <span className="text-sm text-slate-800 dark:text-slate-300">{customer.topupFreq || 0}x/bln</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Travel Score</span>
                  <span className="text-sm text-slate-800 dark:text-slate-300">{parseFloat(customer.travelScore || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Complaints</span>
                  <span className="text-sm text-slate-800 dark:text-slate-300">{customer.complaintCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Pengeluaran</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Rp {(customer.totalSpend || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {/* Pagination controls (mobile) */}
        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">Halaman {currentPage} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded px-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >Prev</button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded px-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >Next</button>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="ml-2 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 px-2 py-1">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Customer ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Data (GB)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Video %</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">Panggilan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">SMS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Pengeluaran</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Top Up Freq</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Travel Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">Complaints</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    {customers.length === 0 ? 'Memuat data pelanggan...' : 'Tidak ada pelanggan ditemukan'}
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, idx) => (
                  <tr 
                    key={customer.id || customer.customerId || idx} 
                    className="border-b border-slate-200 dark:border-slate-800 transition hover:bg-slate-100 dark:hover:bg-slate-800/30 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {customer.customerId || customer.id || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400">
                        {customer.planType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">
                      <div className="max-w-[120px] truncate" title={customer.device || 'N/A'}>
                        {customer.device || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap">
                      {(customer.dataUsage || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">
                      {parseFloat(customer.videoPercentage || 0).toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">
                      {parseFloat(customer.callMinutes || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">
                      {customer.smsCount || 0}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      Rp {(customer.totalSpend || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap">
                      {customer.topupFreq || 0}x/bln
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">
                      {parseFloat(customer.travelScore || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">
                      {customer.complaintCount || 0}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openAnalysis(customer)}
                          className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lg hover:shadow-cyan-500/30"
                        >
                          Analisis
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer.customerId || customer.id, customer.customerId || customer.id || 'pelanggan ini')}
                          className="rounded-lg bg-red-500/20 border border-red-500/30 p-2 text-red-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-red-500/30"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desktop pagination */}
      <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="text-sm text-slate-600 dark:text-slate-400">Menampilkan {Math.min(filteredCustomers.length, pageSize)} dari {filteredCustomers.length} hasil</div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded px-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >Prev</button>
          <div className="text-sm text-slate-700 dark:text-slate-300 px-3">{currentPage} / {totalPages}</div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="rounded px-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >Next</button>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="ml-2 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 px-2 py-1">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Analysis Modal */}
      {(showAnalysis || selectedCustomer) && createPortal(
        <div 
          className={`fixed inset-0 flex items-start justify-end p-0 ${isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'}`}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            opacity: 1
          }}
          onClick={closeAnalysis}
        >
          <div
            className={`relative h-full w-full max-w-2xl md:max-w-xl lg:max-w-2xl rounded-l-xl border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 shadow-2xl overflow-y-auto ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              zIndex: 100000,
              position: 'relative',
              opacity: 1,
              display: 'block',
              visibility: 'visible',
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analisis Pelanggan</h2>
              <button
                onClick={closeAnalysis}
                className="rounded-lg text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white p-1"
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            {selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedCustomer.customerId || selectedCustomer.id || 'N/A'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Plan: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{selectedCustomer.planType || 'N/A'}</span></p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Device: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{selectedCustomer.device || 'N/A'}</span></p>
                  </div>
                  {userCategory && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-300">
                      <Sparkles size={14} /> {userCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Churn Risk */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:text-red-400">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Estimated churn rate</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{((churnInsight?.probability || 0) * 100).toFixed(1)}%</span>
                        <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                          {churnInsight?.label === 'high' ? 'High' : churnInsight?.label === 'medium' ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <p>Risk label</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{churnInsight?.raw_label || 'General Offer'}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">AI Risk Analysis</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {aiInsights?.churn_analysis || 'Analisis churn belum tersedia untuk pelanggan ini.'}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles size={18} className="text-cyan-600 dark:text-cyan-300" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Product Recommendations</h4>
                  </div>
                  {insightLoading && <span className="text-xs text-slate-600 dark:text-slate-400">Memuat rekomendasi...</span>}
                </div>
                <div className="space-y-3">
                  {(recommendations || []).map((item, idx) => (
                    <div key={`${item.product_name}-${idx}`} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3 flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold">#{idx + 1}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.product_name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {item.category} · {item.duration_days} days · Rp {Number(item.price || 0).toLocaleString('id-ID')}
                        </p>
                        {item.reasons?.length > 0 && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">{item.reasons[0]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><Sparkles size={16} className="text-cyan-600 dark:text-cyan-300" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">AI Analysis</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {aiInsights?.product_recommendation || 'Analisis AI belum tersedia untuk pelanggan ini.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Pattern & Finance */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">Pola Penggunaan <ChevronRight size={14} className="text-slate-400" /></h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>📊 Data: <span className="font-semibold text-slate-900 dark:text-white">{(selectedCustomer.dataUsage || 0).toFixed(1)} GB</span></li>
                    <li>🎬 Video: <span className="font-semibold text-slate-900 dark:text-white">{parseFloat(selectedCustomer.videoPercentage || 0).toFixed(1)}%</span></li>
                    <li>📞 Panggilan: <span className="font-semibold text-slate-900 dark:text-white">{parseFloat(selectedCustomer.callMinutes || 0).toFixed(1)} menit</span></li>
                    <li>💬 SMS: <span className="font-semibold text-slate-900 dark:text-white">{selectedCustomer.smsCount || 0}</span></li>
                    <li>🌍 Travel Score: <span className="font-semibold text-slate-900 dark:text-white">{parseFloat(selectedCustomer.travelScore || 0).toFixed(2)}</span></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">Detail Finansial <ChevronRight size={14} className="text-slate-400" /></h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>💰 Pengeluaran Bulanan: <span className="font-semibold text-slate-900 dark:text-white">Rp {(selectedCustomer.totalSpend || 0).toLocaleString('id-ID')}</span></li>
                    <li>💳 Top-up Frekuensi: <span className="font-semibold text-slate-900 dark:text-white">{selectedCustomer.topupFreq || 0}x</span></li>
                    <li>⚠️ Jumlah Keluhan: <span className="font-semibold text-slate-900 dark:text-white">{selectedCustomer.complaintCount || 0}</span></li>
                    <li>🎯 Target Offer: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{selectedCustomer.targetOffer || 'General Offer'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">Memuat data pelanggan...</p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={closeAnalysis}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                type="button"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Customer Modal */}
      {showModal && createPortal(
        <div 
          className={`fixed inset-0 flex items-start justify-end p-0 ${isModalClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'}`}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            opacity: 1
          }}
          onClick={handleCloseModal}
        >
          <div
            className={`relative h-full w-full max-w-2xl md:max-w-xl lg:max-w-2xl rounded-l-xl border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl overflow-y-auto ${isModalClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              zIndex: 100000,
              position: 'relative',
              opacity: 1,
              display: 'block',
              visibility: 'visible',
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Tambah Pelanggan Baru</h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-200px)] space-y-4 overflow-y-auto">
              <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3 mb-2 text-slate-800 dark:text-slate-100">
                <p className="text-sm">
                  <span className="font-semibold">Customer ID otomatis</span> dibuat saat menyimpan.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Customer ID</label>
                <input
                  type="text"
                  value={generateCustomerId()}
                  disabled
                  readOnly
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 px-4 py-2 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">ID akan otomatis dibuat saat menyimpan</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Plan Type</label>
                  <select
                    name="plan_type"
                    value={formData.plan_type}
                    onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  >
                    <option value="Prepaid">Prepaid</option>
                    <option value="Postpaid">Postpaid</option>
                  </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Device Brand</label>
                  <input
                    type="text"
                    name="device_brand"
                    value={formData.device_brand}
                    onChange={handleFormChange}
                    placeholder="Samsung, Apple, Xiaomi, dll"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data Usage (GB)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="avg_data_usage_gb"
                    value={formData.avg_data_usage_gb}
                    onChange={handleFormChange}
                    placeholder="0.0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Video Usage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    name="pct_video_usage"
                    value={formData.pct_video_usage}
                    onChange={handleFormChange}
                    placeholder="0.0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Call Duration (menit)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="avg_call_duration"
                    value={formData.avg_call_duration}
                    onChange={handleFormChange}
                    placeholder="0.0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">SMS Frequency</label>
                  <input
                    type="number"
                    name="sms_freq"
                    value={formData.sms_freq}
                    onChange={handleFormChange}
                    placeholder="0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Spend (Rp)</label>
                  <input
                    type="number"
                    name="monthly_spend"
                    value={formData.monthly_spend}
                    onChange={handleFormChange}
                    placeholder="0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Top Up Frequency (x/bln)</label>
                  <input
                    type="number"
                    name="topup_freq"
                    value={formData.topup_freq}
                    onChange={handleFormChange}
                    placeholder="0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Travel Score</label>
                  <input
                    type="number"
                    step="0.01"
                    name="travel_score"
                    value={formData.travel_score}
                    onChange={handleFormChange}
                    placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Complaint Count</label>
                  <input
                    type="number"
                    name="complaint_count"
                    value={formData.complaint_count}
                    onChange={handleFormChange}
                    placeholder="0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCustomer}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Tambah Pelanggan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pelanggan"
        message={`Apakah Anda yakin ingin menghapus pelanggan "${deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default UserProfile






