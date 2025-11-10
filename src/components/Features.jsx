import React from 'react'
import '../styles/Features.css'

const Features = () => {
  const features = [
    {
      icon: '📶',
      title: 'INTERNET UNLIMITED',
      description: 'Nikmati internet unlimited dengan kecepatan tinggi. Streaming, gaming, dan browsing tanpa batas.'
    },
    {
      icon: '💬',
      title: 'SMS & TELEPON',
      description: 'Paket lengkap dengan kuota SMS dan menit telepon untuk komunikasi tanpa batas.'
    },
    {
      icon: '📦',
      title: 'PAKET FLEKSIBEL',
      description: 'Pilih paket sesuai kebutuhan: harian, mingguan, atau bulanan. Mulai dari Rp 50.000.'
    },
    {
      icon: '🎯',
      title: 'REKOMENDASI CERDAS',
      description: 'Sistem AI menganalisis pola penggunaan Anda dan merekomendasikan paket yang paling optimal.'
    },
    {
      icon: '📱',
      title: 'AKSES DI MANA SAJA',
      description: 'Jaringan luas dengan coverage terbaik. Nikmati layanan berkualitas di seluruh Indonesia.'
    },
    {
      icon: '⚡',
      title: 'AKTIFASI INSTAN',
      description: 'Paket aktif dalam hitungan detik. Tidak perlu menunggu lama, langsung bisa digunakan.'
    }
  ]

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Kenapa Memilih TELMI?</h2>
          <p className="features-subtitle">
            Kami menyediakan layanan telekomunikasi terbaik dengan teknologi canggih dan jaringan yang luas. 
            Nikmati pengalaman komunikasi tanpa batas dengan fitur-fitur unggulan kami.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
                <div className="icon-glow"></div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-cta">
                <span>Pelajari lebih lanjut</span>
                <span className="cta-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
        <div className="features-cta-section">
          <div className="cta-card">
            <div className="cta-icon">🚀</div>
            <h3>Siap Bergabung?</h3>
            <p>Rasakan kecepatan dan kenyamanan layanan kami sekarang juga!</p>
            <button className="cta-button">Mulai Sekarang</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features







