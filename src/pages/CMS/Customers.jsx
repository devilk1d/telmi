import React, { useState } from 'react'
import '../../styles/CMS/Customers.css'

const Customers = () => {
  const [customers] = useState([
    { id: 1, name: 'Budi Santoso', phone: '081234567890', package: 'Unlimited+', status: 'Aktif', joinDate: '2024-01-15' },
    { id: 2, name: 'Siti Nurhaliza', phone: '081987654321', package: 'Premium+', status: 'Aktif', joinDate: '2024-01-20' },
    { id: 3, name: 'Ahmad Dahlan', phone: '082123456789', package: 'Hemat Data', status: 'Aktif', joinDate: '2024-02-01' },
    { id: 4, name: 'Dewi Sartika', phone: '083234567890', package: 'Unlimited+', status: 'Nonaktif', joinDate: '2023-12-10' }
  ])

  return (
    <div className="cms-customers">
      <div className="page-header">
        <div>
          <h1>Kelola Pelanggan</h1>
          <p>Daftar semua pelanggan TELMI</p>
        </div>
        <div className="header-actions">
          <input type="text" placeholder="Cari pelanggan..." className="search-input" />
          <button className="btn-primary">
            <span>+</span> Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="customers-stats">
        <div className="stat-box">
          <h3>Total Pelanggan</h3>
          <p className="stat-number">12,543</p>
        </div>
        <div className="stat-box">
          <h3>Pelanggan Aktif</h3>
          <p className="stat-number">10,234</p>
        </div>
        <div className="stat-box">
          <h3>Pelanggan Baru (Bulan Ini)</h3>
          <p className="stat-number">1,234</p>
        </div>
      </div>

      <div className="customers-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>No. Telepon</th>
              <th>Paket</th>
              <th>Status</th>
              <th>Tanggal Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>#{customer.id}</td>
                <td><strong>{customer.name}</strong></td>
                <td>{customer.phone}</td>
                <td>{customer.package}</td>
                <td>
                  <span className={`status-badge ${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td>{customer.joinDate}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">👁️ Lihat</button>
                    <button className="btn-edit">✏️ Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers



