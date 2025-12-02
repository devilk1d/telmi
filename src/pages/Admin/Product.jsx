import React, { useState, useEffect } from 'react'
import { getPackages, createPackage, updatePackage, deletePackage } from '../../services/api'
import '../../styles/Admin/Product.css'
// Menggunakan ikon dari Heroicons/Lucide untuk tampilan yang lebih modern
import { Search, Settings, Edit2, Trash2 } from 'lucide-react'; 

const Product = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: 'Data',
    price: '',
    duration: '30',
    dataCapacity: '',
    minutes: '',
    sms: '',
    vodAccess: false
  })

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const data = await getPackages()
        setPackages(data)
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handleAddPackage = () => {
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
      vodAccess: false
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

  const handleEditPackage = (pkg) => {
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
      vodAccess: pkg.vodAccess || false
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPackage(null)
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
      // Refresh packages list
      const data = await getPackages()
      setPackages(data)
      handleCloseModal()
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleDeletePackage = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await deletePackage(id)
        setPackages(packages.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error deleting package:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="cms-packages">
        <div className="loading-state">
          <p>Memuat data paket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cms-packages">
      <div className="page-header">
        <div>
          <h1>Product Management</h1>
          <p>Kelola dan tambah produk baru</p>
        </div>
        <button className="btn-primary" onClick={handleAddPackage}>
          <span>+</span> Tambah Produk
        </button>
        
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Cari produk, category, atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-filter">
          <Settings size={18} /> Filter
        </button>
      </div>

      <div className="packages-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Data (GB)</th>
              <th>Minutes</th>
              <th>SMS</th>
              <th>VOD</th>
              <th className='actions-column'>Actions</th> {/* Kolom Aksi */}
            </tr>
          </thead>
          <tbody>
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan="11" className="empty-row"> {/* Colspan diperbarui */}
                  <p>Tidak ada produk ditemukan</p>
                </td>
              </tr>
            ) : (
              filteredPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="product-id">
                    {pkg.productId || `PRD${pkg.id.toString().padStart(3, '0')}`}
                  </td>
                  <td className="product-name">{pkg.productName || pkg.name || 'N/A'}</td>
                  <td className="description">
                    {(pkg.description || '').substring(0, 50)}...
                  </td>
                  <td>
                    <span className="category-badge category-data">
                      {pkg.category || 'N/A'}
                    </span>
                  </td>
                  <td className="amount">
                    Rp {(pkg.price || 0).toLocaleString('id-ID')}
                  </td>
                  <td>{pkg.duration || 30} days</td>
                  <td>{pkg.dataCapacity || 0} GB</td>
                  <td>{pkg.minutes || 0} min</td>
                  <td>{pkg.sms || 0} SMS</td>
                  <td>
                    {pkg.vodAccess ? (
                      <span className="vod-badge enabled">✓</span>
                    ) : (
                      <span className="vod-badge disabled">✗</span>
                    )}
                  </td>
                    <td className='actions-column'>
                        <div className='action-buttons'>
                            <button className='btn-action edit' onClick={() => handleEditPackage(pkg)}>
                                <Edit2 size={16} />
                            </button>
                            <button className='btn-action delete' onClick={() => handleDeletePackage(pkg.id)}>
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

      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
                {/* Form Elements Here (Sama seperti sebelumnya) */}
                <div className="form-group">
                <label htmlFor="productName">Nama Paket</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleFormChange}
                  placeholder="Masukkan nama paket"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Deskripsi</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Masukkan deskripsi paket"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Kategori</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    <option value="Hemat Data">Hemat Data</option>
                    <option value="Unlimited">Unlimited</option>
                    <option value="Premium">Premium</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Harga (Rp)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Durasi (hari)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dataCapacity">Data (GB)</label>
                  <input
                    type="number"
                    id="dataCapacity"
                    name="dataCapacity"
                    value={formData.dataCapacity}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minutes">Menit Panggilan</label>
                  <input
                    type="number"
                    id="minutes"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sms">SMS</label>
                  <input
                    type="number"
                    id="sms"
                    name="sms"
                    value={formData.sms}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="vodAccess"
                  name="vodAccess"
                  checked={formData.vodAccess}
                  onChange={handleFormChange}
                />
                <label htmlFor="vodAccess">Akses Video on Demand</label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>Batal</button>
              <button className="btn-primary" onClick={handleSavePackage}>
                {editingPackage ? 'Simpan Perubahan' : 'Tambah Paket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product