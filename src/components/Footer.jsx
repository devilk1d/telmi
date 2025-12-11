import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Info, LogIn } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.jsx'

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className="relative border-t bg-slate-950 dark:bg-slate-950 bg-white border-slate-200 dark:border-slate-800 transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-100 opacity-40"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-slate-200 dark:border-slate-800 shadow-md shadow-black/10 overflow-hidden">
                <img src="/logo.png" alt="Telvora logo" className="h-8 w-8 object-contain" loading="lazy" />
              </div>
              <span className="text-xl font-bold text-white">
                Telvora
              </span>
            </Link>
            <p className="text-sm text-slate-900 dark:text-white leading-relaxed max-w-xs">
              Platform analitik internal untuk mengelola pelanggan dan rekomendasi berbasis Machine Learning.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Navigasi</h4>
                {/* Judul Navigasi hanya satu, warna putih di dark, hitam di light */}

            <ul className="space-y-3">
              <li>
                    <Link 
                      to="/"
                      className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <Home className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <Link 
                      to="/tentang-sistem"
                      className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <Info className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Tentang Sistem</span>
                </Link>
              </li>
              <li>
                <Link 
                      to="/login"
                      className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Login Admin</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Additional Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Kontak</h4>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <p className="text-slate-900 dark:text-slate-300">Email: info@telvora.com</p>
                  <p className="text-slate-900 dark:text-slate-300">Telepon: +62 812 3456 7890</p>
                  <p className="text-slate-900 dark:text-slate-400">Alamat: Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 mt-8">
              <p className="text-sm text-center text-slate-900 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Telvora. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
















