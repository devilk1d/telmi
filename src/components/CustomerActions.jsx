import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiCheckCircle, FiCopy } from 'react-icons/fi';
import '../styles/CustomerActions.css';

const CustomerActions = () => {
  const [copied, setCopied] = useState(null);

  const actions = [
    {
      icon: <FiEdit />,
      title: 'FORMAT PENDAFTARAN',
      text: 'DP 2210 KE 222',
      description: 'Kirim SMS untuk mendaftar paket baru',
      color: '#007bff'
    },
    {
      icon: <FiTrash2 />,
      title: 'BATALKAN LANGGANAN',
      text: 'HUY 2210 KE 222',
      description: 'Batalkan paket aktif kapan saja',
      color: '#dc3545'
    },
    {
      icon: <FiCheckCircle />,
      title: 'CEK PAKET AKTIF',
      text: 'PA ALL KE 222',
      description: 'Cek status dan sisa kuota paket Anda',
      color: '#28a745'
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="customer-actions">
      <div className="customer-actions-container">
        <div className="section-header">
          <h2 className="section-title">Kelola Langganan Anda</h2>
          <p className="section-subtitle">Akses cepat untuk mengelola paket Anda melalui SMS.</p>
        </div>
        <div className="action-cards">
          {actions.map((action, index) => (
            <div key={index} className="action-card" style={{ '--card-color': action.color }}>
              <div className="action-icon">{action.icon}</div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
              <div className="action-text-wrapper">
                <p className="action-text">{action.text}</p>
                <button 
                  className="copy-button" 
                  onClick={() => handleCopy(action.text, index)}
                  title={copied === index ? 'Disalin!' : 'Salin'}
                >
                  {copied === index ? <FiCheckCircle /> : <FiCopy />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerActions;








