import React from 'react';
import { FiPackage, FiCreditCard, FiCheckCircle, FiWifi } from 'react-icons/fi';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiPackage />,
      title: 'Pilih Paket',
      description: 'Lihat berbagai pilihan paket yang tersedia atau gunakan fitur rekomendasi untuk mendapatkan paket yang sesuai.'
    },
    {
      icon: <FiCreditCard />,
      title: 'Daftar & Bayar',
      description: 'Daftar dengan mudah melalui SMS atau website. Pembayaran bisa via transfer bank, e-wallet, atau pulsa.'
    },
    {
      icon: <FiCheckCircle />,
      title: 'Aktifasi Instan',
      description: 'Paket Anda akan aktif dalam hitungan detik setelah pembayaran terkonfirmasi.'
    },
    {
      icon: <FiWifi />,
      title: 'Nikmati Layanan',
      description: 'Mulai gunakan internet, SMS, dan telepon sesuai paket yang Anda pilih. Pantau penggunaan di dashboard.'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <div className="section-header">
          <h2 className="section-title">Bagaimana Caranya?</h2>
          <p className="section-subtitle">Hanya dalam 4 langkah mudah, Anda bisa langsung terhubung.</p>
        </div>
        <div className="steps-timeline">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;







