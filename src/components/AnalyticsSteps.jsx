import React from 'react'
import '../styles/AnalyticsSteps.css'

const steps = [
  { no: 1, text: 'Login ke dashboard' },
  { no: 2, text: 'Analisis pola penggunaan' },
  { no: 3, text: 'Rekomendasi otomatis tampil' },
  { no: 4, text: 'Feedback untuk perbaikan sistem' },
]

const AnalyticsSteps = () => {
  return (
    <section className="analytics-steps">
      <div className="container">
        <h2>Cara Kerja Sistem</h2>
        <div className="steps-grid-custom">
          <div className="steps-row">
            <div className="step-item">
              <div className="step-no">{steps[0].no}</div>
              <div className="step-text">{steps[0].text}</div>
            </div>
            <div className="step-item">
              <div className="step-no">{steps[1].no}</div>
              <div className="step-text">{steps[1].text}</div>
            </div>
          </div>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-no">{steps[2].no}</div>
              <div className="step-text">{steps[2].text}</div>
            </div>
            <div className="step-item">
              <div className="step-no">{steps[3].no}</div>
              <div className="step-text">{steps[3].text}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsSteps
