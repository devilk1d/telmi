import React from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Konfirmasi', 
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null

  const typeStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-500 text-white',
      icon: 'text-red-400',
      border: 'border-red-500/30'
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-500 text-white',
      icon: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-500 text-white',
      icon: 'text-blue-400',
      border: 'border-blue-500/30'
    }
  }

  const styles = typeStyles[type] || typeStyles.danger

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[99999] animate-fade-in-overlay"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-fade-in-up text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 p-3 rounded-xl border ${
            type === 'danger' ? 'bg-red-500/10 border-red-500/30' :
            type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <AlertTriangle className={styles.icon} size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-medium transition-all duration-200 hover:bg-slate-700 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg ${styles.button} font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmDialog

