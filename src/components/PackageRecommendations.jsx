import React, { useState } from 'react'
import '../styles/PackageRecommendations.css'

const PackageRecommendations = () => {
  const [currentPackage, setCurrentPackage] = useState(0)

  const packages = [
    { 
      name: 'Paket 2210', 
      price: 'RP120K', 
      description: 'Paket hemat untuk penggunaan harian yang stabil', 
      features: ['1GB/hari internet', '100SMS', '60menit telepon', 'Auto-renew otomatis'],
      popular: true,
      new: false
    },
    { 
      name: 'Paket 5510', 
      price: 'RP220K', 
      description: 'Paket optimal untuk pengguna aktif media sosial', 
      features: ['2GB/hari internet', '200SMS', '120menit telepon', 'Prioritas jaringan'],
      popular: false,
      new: true
    },
    { 
      name: 'Paket 8810', 
      price: 'RP350K', 
      description: 'Paket premium untuk penggunaan intensif', 
      features: ['3GB/hari internet', '300SMS', '180menit telepon', 'Support 24/7'],
      popular: false,
      new: false
    },
    { 
      name: 'Paket 11010', 
      price: 'RP450K', 
      description: 'Paket unlimited untuk profesional', 
      features: ['5GB/hari internet', '500SMS', '300menit telepon', 'Jaminan kecepatan'],
      popular: false,
      new: true
    }
  ]

  const nextPackage = () => {
    setCurrentPackage((prev) => (prev + 1) % packages.length)
  }

  const prevPackage = () => {
    setCurrentPackage((prev) => (prev - 1 + packages.length) % packages.length)
  }

  return (
    <section className="package-recommendations">
      <div className="package-container">
        <div className="featured-package">
          <div className="package-header">
            <h3>Paket 2210</h3>
            <div className="arrow-icon">→</div>
          </div>
          <div className="package-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Rekomendasi Terbaik</span>
          </div>
          <ul className="package-benefits">
            <li>1 GB/hari untuk akses internet berkecepatan tinggi. Setelah kuota habis, pengguna tetap dapat menggunakan layanan Data MD sesuai ketentuan yang berlaku.</li>
            <li>Kuota SMS dan telepon sesuai paket yang dipilih. Layanan aktif 24/7 dengan kualitas suara jernih.</li>
            <li>Auto-renew otomatis setiap bulan. Tidak perlu khawatir paket terputus di tengah bulan.</li>
          </ul>
          <div className="package-price">
            RP120K <span>/bulan</span>
          </div>
          <div className="package-stats">
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Pelanggan Puas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
          <button className="btn-primary">
            <span>Pilih Paket</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
        <div className="recommended-packages">
          <div className="recommendation-header">
            <h2 className="recommendation-title">Rekomendasi Paket</h2>
            <p className="recommendation-subtitle">Pilih paket yang sesuai dengan kebutuhan Anda</p>
            <div className="recommendation-badges">
              <span className="badge-popular">🔥 Terpopuler</span>
              <span className="badge-new">✨ Terbaru</span>
            </div>
          </div>
          
          <div className="package-cards">
            {packages.map((pkg, index) => (
              <div key={index} className={`package-card ${pkg.popular ? 'popular' : ''} ${pkg.new ? 'new' : ''}`}>
                {pkg.popular && (
                  <div className="card-ribbon">
                    <span>🔥 Populer</span>
                  </div>
                )}
                {pkg.new && (
                  <div className="card-badge-new">
                    <span>✨ Baru</span>
                  </div>
                )}
                <div className="package-card-header">
                  <h4 className="package-name">{pkg.name}</h4>
                  <div className="package-card-price">{pkg.price}</div>
                </div>
                <p className="package-card-description">{pkg.description}</p>
                <ul className="package-card-features">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button className={`package-card-btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  <span>Pilih Paket</span>
                  <span className="btn-icon">→</span>
                </button>
              </div>
            ))}
          </div>
          
          <div className="recommendation-cta">
            <div className="cta-card">
              <div className="cta-icon">💡</div>
              <h3>Butuh Bantuan Memilih?</h3>
              <p>Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan rekomendasi terbaik</p>
              <button className="btn-outline">Konsultasi Gratis</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PackageRecommendations







