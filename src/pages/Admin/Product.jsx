import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPackages, createPackage, updatePackage, deletePackage } from '../../services/api'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import ConfirmDialog from '../../components/ConfirmDialog'

const Product = () => {
  const sortPackages = (list) => {
    return [...list].sort((a, b) => {
      const nameA = (a.productName || a.name || '').toLowerCase()
      const nameB = (b.productName || b.name || '').toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      const idA = (a.productId || a.id || '').toString()
      const idB = (b.productId || b.id || '').toString()
      return idA.localeCompare(idB)
    })
  }
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' })
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: 'Data',
    price: '',
    duration: '30',
    dataCapacity: '',
    minutes: '',
    sms: '',
    vodCapacity: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const data = await getPackages()
        setPackages(sortPackages(data))
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleAddPackage = () => {
    console.log('Opening add package modal')
    setEditingPackage(null)
    setFormData({
      productName: '',
      description: '',
      category: 'Data',
      price: '',
      duration: '30',
      dataCapacity: '',
      minutes: '',
      sms: '',
      vodCapacity: ''
    })
    setShowModal(true)
  }

  const filteredPackages = packages.filter(pkg => {
    const searchLower = searchTerm.toLowerCase()
    const productName = (pkg.productName || pkg.name || '').toLowerCase()
    const productId = (pkg.productId || pkg.id || '').toString().toLowerCase()
    const description = (pkg.description || '').toLowerCase()
    return productName.includes(searchLower) || productId.includes(searchLower) || description.includes(searchLower)
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, pageSize])

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredPackages.length / pageSize))
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages)
    }
  }, [filteredPackages.length, pageSize, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / pageSize))
  const paginatedPackages = filteredPackages.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleEditPackage = (pkg) => {
    console.log('Opening edit package modal:', pkg)
    setEditingPackage(pkg)
    setFormData({
      productName: pkg.productName || pkg.name || '',
      description: pkg.description || '',
      category: pkg.category || 'Unlimited',
      price: pkg.price || '',
      duration: pkg.duration || '30',
      dataCapacity: pkg.dataCapacity || '',
      minutes: pkg.minutes || '',
      sms: pkg.sms || '',
      vodCapacity: pkg.vodCapacity || ''
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
      setEditingPackage(null)
    }, 400) // Match animation duration
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSavePackage = async () => {
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, formData)
      } else {
        await createPackage(formData)
      }
      const data = await getPackages()
      setPackages(sortPackages(data))
      handleCloseModal()
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ isOpen: true, id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return
    
    try {
      await deletePackage(deleteConfirm.id)
      const data = await getPackages()
      setPackages(sortPackages(data))
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
          <p className="text-slate-400">Memuat data paket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Kelola dan tambah produk baru</p>
        </div>
        <button
          onClick={handleAddPackage}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Products</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{packages.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Active product catalog</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Available for sale</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Categories</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{new Set(packages.map(p => p.category)).size}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Product categories</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Unique segments</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg Price</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{packages.length > 0 ? `Rp ${(packages.reduce((sum, p) => sum + (p.price || 0), 0) / packages.length).toLocaleString('id-ID')}` : 'Rp 0'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Average product price</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Across catalog</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-lg">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg Duration</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{packages.length > 0 ? `${(packages.reduce((sum, p) => sum + (p.duration || p.durationDays || 30), 0) / packages.length).toFixed(0)} days` : '0 days'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Average plan duration</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">Per subscription</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari produk, kategori, atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedPackages.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">
            {packages.length === 0 ? 'Memuat data produk...' : 'Tidak ada produk ditemukan'}
          </div>
        ) : (
          paginatedPackages.map((pkg, idx) => (
            <div
              key={pkg.id || pkg.productId || idx}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate mb-1">{pkg.productName || pkg.name || 'N/A'}</h3>
                  <p className="text-xs text-slate-400">ID: {pkg.productId || pkg.id || 'N/A'}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-2 text-cyan-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-cyan-500/30"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(pkg.id || pkg.productId, pkg.productName || pkg.name || 'produk ini')}
                    className="rounded-lg bg-red-500/20 border border-red-500/30 p-2 text-red-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-red-500/30"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Kategori</span>
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    pkg.category === 'Data' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    pkg.category === 'Combo' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                    pkg.category === 'VOD' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' :
                    pkg.category === 'Roaming' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                    pkg.category === 'Device Bundle' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    pkg.category === 'Voice' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}>
                    {pkg.category || 'Data'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Harga</span>
                  <span className="text-sm font-semibold text-white">Rp {(pkg.price || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Data</span>
                  <span className="text-sm text-slate-300">{parseFloat(pkg.dataCapacity || 0).toFixed(1)} GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Durasi</span>
                  <span className="text-sm text-slate-300">{pkg.duration || pkg.durationDays || 30} hari</span>
                </div>
                {pkg.description && (
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
                  </div>
                )}
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
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Product ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap min-w-[200px]">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap min-w-[150px] hidden lg:table-cell">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Data (GB)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Durasi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">Menit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">SMS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">VOD</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPackages.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    {packages.length === 0 ? 'Memuat data produk...' : 'Tidak ada produk ditemukan'}
                  </td>
                </tr>
              ) : (
                paginatedPackages.map((pkg, idx) => (
                  <tr 
                    key={pkg.id || pkg.productId || idx} 
                    className="border-b border-slate-200 dark:border-slate-800 transition hover:bg-slate-100 dark:hover:bg-slate-800/30 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {pkg.productId || pkg.id || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300">
                      <div className="max-w-[200px] truncate" title={pkg.productName || pkg.name || 'N/A'}>
                        {pkg.productName || pkg.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                      <div className="max-w-[150px] truncate" title={pkg.description || 'Tidak ada deskripsi'}>
                        {pkg.description || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold border ${
                        pkg.category === 'Data' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        pkg.category === 'Combo' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        pkg.category === 'VOD' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' :
                        pkg.category === 'Roaming' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                        pkg.category === 'Device Bundle' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        pkg.category === 'Voice' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {pkg.category || 'Data'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      Rp {(pkg.price || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">
                      {parseFloat(pkg.dataCapacity || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">
                      {pkg.duration || pkg.durationDays || 30}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">
                      {parseFloat(pkg.minutes || 0).toFixed(0)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">
                      {parseFloat(pkg.sms || 0).toFixed(0)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">
                      {parseFloat(pkg.vodCapacity || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-2 text-cyan-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-cyan-500/30"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pkg.id || pkg.productId, pkg.productName || pkg.name || 'produk ini')}
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
        {/* Desktop pagination */}
      <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="text-sm text-slate-600 dark:text-slate-400">Menampilkan {Math.min(filteredPackages.length, pageSize)} dari {filteredPackages.length} hasil</div>
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
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div 
          className={`fixed inset-0 flex items-start justify-end p-0 ${isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'}`}
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-200px)] space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Paket</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleFormChange}
                  placeholder="Masukkan nama paket"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Masukkan deskripsi paket"
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  >
                    <option value="Data">Data</option>
                    <option value="Combo">Combo</option>
                    <option value="VOD">VOD</option>
                    <option value="Roaming">Roaming</option>
                    <option value="Device Bundle">Device Bundle</option>
                    <option value="Voice">Voice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Durasi (hari)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="30"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data (GB)</label>
                  <input
                    type="number"
                    name="dataCapacity"
                    value={formData.dataCapacity}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Menit Panggilan</label>
                  <input
                    type="number"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">SMS</label>
                  <input
                    type="number"
                    name="sms"
                    value={formData.sms}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">VOD (GB)</label>
                <input
                  type="number"
                  name="vodCapacity"
                  value={formData.vodCapacity}
                  onChange={handleFormChange}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-500 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSavePackage}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                {editingPackage ? 'Simpan Perubahan' : 'Tambah Paket'}
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
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default Product
