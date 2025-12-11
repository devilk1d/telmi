import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const codeLines = [
  'const fetchCustomers = async () => {',
  '  const response = await api.get("/customers")',
  '  return response.data.map((item) => ({',
  '    id: item.id,',
  '    status: getHealthScore(item.metrics)',
  '  }))',
  '}',
  '',
  'const recommendations = buildPackage(userProfile)',
  'console.log("Best offer →", recommendations[0])'
]

const AnalyticsHero = () => {
  const [activeLine, setActiveLine] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % codeLines.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-slate-950">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in-up text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/70 border border-slate-700 text-slate-100 text-xs md:text-sm font-medium w-fit animate-fade-in delay-100 transition-colors duration-200 hover:bg-slate-700 hover:border-slate-500 animate-float-soft mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Powered by Machine Learning</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent animate-fade-in-up delay-200">
              <span className="text-slate-900 dark:text-white">Telvora Analytics</span>
              <span className="block text-slate-700 dark:text-slate-200 text-2xl md:text-3xl lg:text-4xl font-semibold mt-2">
                Portal monitoring operasional
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-300">
              <span className="text-slate-600 dark:text-slate-300">
                Platform manajemen pelanggan dan rekomendasi produk berbasis Machine Learning.
                <span className="block mt-2 text-slate-500 dark:text-slate-400">
                  Analisis perilaku pengguna dan tingkatkan engagement dengan rekomendasi yang tepat sasaran.
                </span>
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-500 text-white dark:text-white font-semibold text-base px-8 py-5 h-auto rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <Link to="/login" className="flex items-center gap-2">
                  <span>Login Admin</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 py-5 h-auto border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all duration-300 ease-out rounded-xl hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <Link to="/tentang-sistem" className="flex items-center gap-2">
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right Illustration - Simple Code Panel */}
          <div className="hidden md:flex lg:col-span-4 items-center justify-center animate-fade-in-up delay-400">
            <div className="relative w-full max-w-md transition-transform duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl animate-float-soft">
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-300"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">rekomendasi.js</span>
                </div>
                <pre className="font-mono text-sm text-slate-700 dark:text-slate-300 px-5 py-6 space-y-2">
                  {codeLines.map((line, index) => (
                    <p
                      key={index}
                      className={`transition-colors duration-200 ${
                        index === activeLine ? 'text-cyan-200' : 'text-slate-500'
                      }`}
                    >
                      {line || '\u00A0'}
                    </p>
                  ))}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsHero
