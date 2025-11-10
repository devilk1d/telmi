import React, { useState } from 'react'
import '../../styles/CMS/Packages.css'

const Packages = () => {
  const [packages] = useState([
    { id: 1, name: 'Paket Hemat Data', price: 'Rp 50.000', status: 'Aktif', subscribers: 2341 },
    { id: 2, name: 'Paket Unlimited+', price: 'Rp 120.000', status: 'Aktif', subscribers: 4521 },
    { id: 3, name: 'Paket Premium+', price: 'Rp 250.000', status: 'Aktif', subscribers: 1234 },
    { id: 4, name: 'Paket 2210', price: 'Rp 180.000', status: 'Aktif', subscribers: 2345 }
  ])

  return (
    <div className="cms-packages">
      <div className="page-header">
        <div>
          <h1>Kelola Paket</h1>
          <p>Kelola semua paket layanan TELMI</p>
        </div>
        <button className="btn-primary">
          <span>+</span> Tambah Paket Baru
        </button>
      </div>

      <div className="packages-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Paket</th>
              <th>Harga</th>
              <th>Pelanggan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>#{pkg.id}</td>
                <td><strong>{pkg.name}</strong></td>
                <td>{pkg.price}</td>
                <td>{pkg.subscribers.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${pkg.status.toLowerCase()}`}>
                    {pkg.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">✏️ Edit</button>
                    <button className="btn-delete">🗑️ Hapus</button>
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

export default Packages



