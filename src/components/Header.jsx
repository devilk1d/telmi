import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogIn, Info, Moon, Sun } from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const isAboutPage = location.pathname === '/tentang-sistem'

  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/30 bg-white dark:bg-slate-950 backdrop-blur-xl">
      <nav className="container flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-slate-200 dark:border-slate-800 shadow-md shadow-black/10 overflow-hidden">
            <img src="/logo.png" alt="Telvora logo" className="h-8 w-8 object-contain" loading="lazy" />
          </div>
          <span className="text-lg md:text-xl font-bold text-white">
            <span className="text-slate-900 dark:text-white">Telvora</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            asChild 
            size="sm"
            variant="ghost"
            className="hidden md:flex text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link to="/tentang-sistem" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Tentang Sistem</span>
            </Link>
          </Button>
          <Button 
            asChild 
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white dark:text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </Button>
          <button
            onClick={toggleTheme}
            className="ml-1 md:ml-2 px-2 md:px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all inline-flex items-center gap-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
