import React from 'react';
import { FiAlertTriangle, FiXCircle, FiTrendingDown, FiDollarSign, FiZap, FiCheck } from 'react-icons/fi';
import '../styles/ProblemSolution.css';

const ProblemSolution = () => {
  const problems = [
    {
      icon: <FiAlertTriangle />,
      title: 'Terlalu Banyak Pilihan',
      description: 'Ribuan varian paket membuat pelanggan overwhelmed dan kesulitan memilih yang tepat.'
    },
    {
      icon: <FiXCircle />,
      title: 'Paket Tidak Sesuai',
      description: 'Pelanggan sering membeli paket yang kurang optimal, menyebabkan pemborosan atau kekurangan kuota.'
    },
    {
      icon: <FiTrendingDown />,
      title: 'Churn Rate Tinggi',
      description: 'Ketidakpuasan karena paket tidak sesuai kebutuhan menyebabkan pelanggan pindah ke provider lain.'
    },
    {
      icon: <FiDollarSign />,
      title: 'Marketing Tidak Efisien',
      description: 'Biaya marketing tinggi karena targeting produk yang kurang tepat kepada pelanggan.'
    }
  ];

  const benefits = [
    {
      icon: <FiCheck />,
      title: 'Paket Sesuai Kebutuhan',
      description: 'Sistem rekomendasi cerdas menganalisis pola penggunaan Anda dan menyarankan paket yang paling optimal.'
    },
    {
      icon: <FiDollarSign />,
      title: 'Harga Terjangkau',
      description: 'Paket mulai dari Rp 50.000 dengan berbagai pilihan sesuai budget dan kebutuhan Anda.'
    },
    {
      icon: <FiZap />,
      title: 'Aktifasi Cepat',
      description: 'Paket aktif dalam hitungan detik setelah pembayaran. Tidak perlu menunggu lama.'
    },
    {
      icon: <FiAlertTriangle />,
      title: 'Dukungan 24/7',
      description: 'Tim customer service siap membantu Anda kapan saja melalui berbagai channel komunikasi.'
    }
  ];

  return (
    <section className="problem-solution">
      <div className="problem-solution-container">
        <div className="problem-section">
          <h2 className="section-title">Masalah yang Sering Terjadi</h2>
          <div className="problems-grid">
            {problems.map((problem, index) => (
              <div key={index} className="problem-card">
                <div className="problem-icon">{problem.icon}</div>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="solution-section">
          <h2 className="section-title">Mengapa Pilih TELMI?</h2>
          <div className="solution-content">
            <div className="solution-main">
              <div className="solution-icon"><FiZap /></div>
              <h3>Layanan Terpercaya dengan Teknologi Cerdas</h3>
              <p>
                TELMI menghadirkan layanan telekomunikasi terbaik dengan sistem rekomendasi cerdas berbasis Machine Learning. 
                Kami membantu Anda menemukan paket yang paling sesuai dengan kebutuhan, sehingga Anda tidak perlu bingung memilih dari ribuan opsi paket.
              </p>
            </div>
            <div className="solution-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;

