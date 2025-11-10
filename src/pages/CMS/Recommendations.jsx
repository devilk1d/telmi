import React, { useState } from 'react'
import '../../styles/CMS/Recommendations.css'

const Recommendations = () => {
  const [recommendations] = useState([
    { 
      id: 1, 
      customerId: 'C001',
      customerName: 'Budi Santoso', 
      customerPhone: '081234567890',
      currentPackage: 'Hemat Data',
      recommendedPackage: 'Unlimited+', 
      confidence: 95, 
      status: 'Diterima', 
      date: '2024-02-15',
      mlModel: 'v2.1',
      reason: 'Pola penggunaan tinggi, cocok untuk unlimited'
    },
    { 
      id: 2, 
      customerId: 'C002',
      customerName: 'Siti Nurhaliza', 
      customerPhone: '081987654321',
      currentPackage: 'Unlimited+',
      recommendedPackage: 'Premium+', 
      confidence: 88, 
      status: 'Diterima', 
      date: '2024-02-14',
      mlModel: 'v2.1',
      reason: 'Penggunaan intensif, butuh fitur premium'
    },
    { 
      id: 3, 
      customerId: 'C003',
      customerName: 'Ahmad Dahlan', 
      customerPhone: '082123456789',
      currentPackage: 'Hemat Data',
      recommendedPackage: 'Hemat Data', 
      confidence: 92, 
      status: 'Menunggu', 
      date: '2024-02-15',
      mlModel: 'v2.1',
      reason: 'Paket saat ini sudah optimal'
    },
    { 
      id: 4, 
      customerId: 'C004',
      customerName: 'Dewi Sartika', 
      customerPhone: '083234567890',
      currentPackage: 'Unlimited+',
      recommendedPackage: 'Unlimited+', 
      confidence: 85, 
      status: 'Ditolak', 
      date: '2024-02-13',
      mlModel: 'v2.0',
      reason: 'Pelanggan menolak upgrade'
    }
  ])

  const [selectedRec, setSelectedRec] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPackage, setFilterPackage] = useState('all')

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false
    if (filterPackage !== 'all' && rec.recommendedPackage !== filterPackage) return false
    return true
  })

  const stats = {
    total: recommendations.length,
    accepted: recommendations.filter(r => r.status === 'Diterima').length,
    pending: recommendations.filter(r => r.status === 'Menunggu').length,
    rejected: recommendations.filter(r => r.status === 'Ditolak').length,
    avgConfidence: Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)
  }

  return (
    <div className="cms-recommendations">
      <div className="page-header">
        <div>
          <h1>Rekomendasi Paket ML</h1>
          <p>Kelola rekomendasi paket berbasis Machine Learning untuk pelanggan</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>📊</span> Analisis Data
          </button>
          <button className="btn-primary">
            <span>🤖</span> Generate Rekomendasi ML
          </button>
        </div>
      </div>

      <div className="recommendations-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Rekomendasi</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <h3>{stats.accepted}</h3>
            <p>Diterima</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Menunggu</p>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.avgConfidence}%</h3>
            <p>Rata-rata Confidence</p>
          </div>
        </div>
      </div>

      <div className="recommendations-filters">
        <div className="filter-group">
          <label>Status</label>
          <select 
            className="filter-select" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Diterima">Diterima</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Paket</label>
          <select 
            className="filter-select"
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
          >
            <option value="all">Semua Paket</option>
            <option value="Hemat Data">Hemat Data</option>
            <option value="Unlimited+">Unlimited+</option>
            <option value="Premium+">Premium+</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tanggal</label>
          <input type="date" className="filter-date" />
        </div>
        <div className="filter-group">
          <label>Search</label>
          <input type="text" className="filter-search" placeholder="Cari pelanggan..." />
        </div>
      </div>

      <div className="recommendations-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Paket Saat Ini</th>
              <th>Rekomendasi</th>
              <th>Confidence</th>
              <th>ML Model</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecommendations.map((rec) => (
              <tr key={rec.id}>
                <td>#{rec.id}</td>
                <td>
                  <div className="customer-info">
                    <strong>{rec.customerName}</strong>
                    <span className="customer-id">{rec.customerId}</span>
                    <span className="customer-phone">{rec.customerPhone}</span>
                  </div>
                </td>
                <td>
                  <span className="package-badge current">{rec.currentPackage}</span>
                </td>
                <td>
                  <span className="package-badge recommended">{rec.recommendedPackage}</span>
                </td>
                <td>
                  <div className="confidence-container">
                    <div className="confidence-bar">
                      <div 
                        className={`confidence-fill ${rec.confidence >= 90 ? 'high' : rec.confidence >= 75 ? 'medium' : 'low'}`}
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                    <span className="confidence-value">{rec.confidence}%</span>
                  </div>
                </td>
                <td>
                  <span className="model-badge">{rec.mlModel}</span>
                </td>
                <td>
                  <span className={`status-badge ${rec.status.toLowerCase()}`}>
                    {rec.status}
                  </span>
                </td>
                <td>{rec.date}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-view" 
                      onClick={() => setSelectedRec(rec)}
                      title="Lihat Detail"
                    >
                      👁️
                    </button>
                    {rec.status === 'Menunggu' && (
                      <>
                        <button className="btn-approve" title="Setujui">✓</button>
                        <button className="btn-reject" title="Tolak">✗</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRec && (
        <div className="modal-overlay" onClick={() => setSelectedRec(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Rekomendasi #{selectedRec.id}</h2>
              <button className="modal-close" onClick={() => setSelectedRec(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Informasi Pelanggan</h3>
                <div className="detail-grid">
                  <div>
                    <label>Nama</label>
                    <p>{selectedRec.customerName}</p>
                  </div>
                  <div>
                    <label>ID Pelanggan</label>
                    <p>{selectedRec.customerId}</p>
                  </div>
                  <div>
                    <label>No. Telepon</label>
                    <p>{selectedRec.customerPhone}</p>
                  </div>
                  <div>
                    <label>Paket Saat Ini</label>
                    <p>{selectedRec.currentPackage}</p>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h3>Rekomendasi ML</h3>
                <div className="detail-grid">
                  <div>
                    <label>Paket Direkomendasikan</label>
                    <p><strong>{selectedRec.recommendedPackage}</strong></p>
                  </div>
                  <div>
                    <label>Confidence Score</label>
                    <p><strong>{selectedRec.confidence}%</strong></p>
                  </div>
                  <div>
                    <label>ML Model</label>
                    <p>{selectedRec.mlModel}</p>
                  </div>
                  <div>
                    <label>Status</label>
                    <p>
                      <span className={`status-badge ${selectedRec.status.toLowerCase()}`}>
                        {selectedRec.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="reason-box">
                  <label>Alasan Rekomendasi</label>
                  <p>{selectedRec.reason}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedRec(null)}>Tutup</button>
              {selectedRec.status === 'Menunggu' && (
                <>
                  <button className="btn-reject">Tolak Rekomendasi</button>
                  <button className="btn-approve">Setujui Rekomendasi</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendations


