import React from 'react'
import '../styles/CallToAction.css'

const CallToAction = () => {
  return (
    <section className="call-to-action">
      <div className="cta-background-pattern"></div>
      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-icon">🚀</div>
          <h2 className="cta-title">Siap Berlangganan?</h2>
          <p className="cta-subtitle">
            Dapatkan paket terbaik untuk kebutuhan komunikasi Anda. 
            <br />
            <span className="highlight">Mulai dari Rp 50.000</span> • Aktifasi Instan • Dukungan 24/7
          </p>
          <div className="cta-features">
            <div className="cta-feature-item">
              <span className="feature-icon">✓</span>
              <span>Tanpa biaya registrasi</span>
            </div>
            <div className="cta-feature-item">
              <span className="feature-icon">✓</span>
              <span>Aktif dalam hitungan detik</span>
            </div>
            <div className="cta-feature-item">
              <span className="feature-icon">✓</span>
              <span>Bisa di-upgrade kapan saja</span>
            </div>
          </div>
        </div>
        <div className="cta-buttons">
          <button className="cta-button">
            <span className="button-icon">📱</span>
            DAFTAR SEKARANG
          </button>
          <button className="cta-button-secondary">
            <span className="button-icon">📦</span>
            LIHAT SEMUA PAKET
          </button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction







