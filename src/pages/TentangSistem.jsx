import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Sparkles, 
  Settings, 
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Brain,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    desc: 'Dashboard komprehensif yang menampilkan ringkasan metrik utama, aktivitas terkini sistem, dan visualisasi data real-time. Monitor performa bisnis Anda dengan mudah melalui interface yang intuitif dan informatif.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Manajemen Pelanggan',
    desc: 'Kelola data pelanggan secara menyeluruh, lakukan analisis perilaku pengguna mendalam, dan identifikasi risiko churn dengan akurasi tinggi. Sistem membantu Anda memahami pelanggan lebih baik untuk meningkatkan retensi.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Package,
    title: 'Katalog Produk',
    desc: 'CRUD lengkap untuk katalog produk dan kelola penawaran paket. Tambah, edit, hapus produk dengan mudah, dan atur paket promosi yang menarik untuk meningkatkan penjualan.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'Rekomendasi Machine Learning',
    desc: 'Sistem AI canggih yang menghasilkan rekomendasi paket berbasis Machine Learning. Analisis pola penggunaan pelanggan dan berikan rekomendasi yang personal dan tepat sasaran untuk meningkatkan konversi.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Settings,
    title: 'Konfigurasi Sistem',
    desc: 'Konfigurasi sistem yang fleksibel, integrasi API yang mudah, dan pengaturan preferensi aplikasi sesuai kebutuhan. Sesuaikan platform dengan workflow bisnis Anda.',
    gradient: 'from-slate-500 to-gray-500',
  },
  {
    icon: BarChart3,
    title: 'Analitik Mendalam',
    desc: 'Analisis churn rate, perilaku pengguna, dan efektivitas produk dengan tools analitik yang powerful. Dapatkan insight yang actionable untuk pengambilan keputusan strategis.',
    gradient: 'from-cyan-500 to-blue-500',
  },
]

const capabilities = [
  {
    icon: Brain,
    title: 'Machine Learning',
    desc: 'Algoritma ML yang terus belajar dari data untuk meningkatkan akurasi rekomendasi',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    desc: 'Analisis data secara real-time untuk insight yang selalu up-to-date',
  },
  {
    icon: Target,
    title: 'Personalized Recommendations',
    desc: 'Rekomendasi yang disesuaikan dengan profil dan preferensi setiap pelanggan',
  },
  {
    icon: Zap,
    title: 'High Performance',
    desc: 'Sistem yang cepat dan responsif untuk pengalaman pengguna yang optimal',
  },
]

const TentangSistem = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <Button 
            asChild 
            variant="ghost" 
            className="mb-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 animate-fade-in-up group"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
          
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-xs md:text-sm font-medium mb-6 animate-fade-in delay-100">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
              <span>Tentang Sistem</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-slate-900 dark:text-white animate-fade-in-up delay-200 tracking-tight">
              Telvora Analytics
              <span className="block text-slate-700 dark:text-slate-200 text-3xl md:text-4xl font-normal mt-2">
                Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 animate-fade-in-up delay-300">
              Platform analitik berbasis Machine Learning yang dirancang untuk membantu bisnis Anda 
              mengelola pelanggan, menganalisis perilaku, dan memberikan rekomendasi produk yang tepat sasaran.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white animate-fade-in-up delay-200 tracking-tight">
              Tentang Telvora Analytics
            </h2>
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in-up delay-300">
              <p className="text-base md:text-lg">
                Telvora Analytics adalah platform analitik canggih yang memanfaatkan teknologi Machine Learning 
                untuk membantu bisnis IPTV mengoptimalkan operasional mereka. Platform ini dirancang khusus untuk 
                mengelola data pelanggan, menganalisis pola penggunaan, dan memberikan rekomendasi produk yang 
                personal dan tepat sasaran.
              </p>
              <p>
                Dengan menggunakan algoritma Machine Learning yang terus belajar dari data, sistem ini mampu 
                memprediksi perilaku pelanggan, mengidentifikasi risiko churn, dan memberikan rekomendasi paket 
                yang paling sesuai dengan kebutuhan setiap pelanggan. Hal ini membantu meningkatkan retensi 
                pelanggan dan konversi penjualan secara signifikan.
              </p>
              <p>
                Platform ini juga dilengkapi dengan dashboard analitik yang komprehensif, memungkinkan Anda 
                untuk memantau metrik bisnis secara real-time, menganalisis tren, dan mengambil keputusan 
                strategis berdasarkan data yang akurat dan terpercaya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in-up delay-200 tracking-tight">
              Bagaimana Sistem Bekerja?
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">1. Koleksi Data</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Sistem mengumpulkan data pelanggan secara real-time, termasuk pola penggunaan, preferensi, 
                  dan interaksi dengan produk. Data ini dikumpulkan secara otomatis dan aman untuk menjaga 
                  privasi pelanggan.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">2. Analisis dengan Machine Learning</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Algoritma Machine Learning menganalisis data yang terkumpul untuk mengidentifikasi pola, 
                  tren, dan insight yang berharga. Sistem menggunakan berbagai model ML termasuk clustering, 
                  classification, dan recommendation algorithms untuk memberikan hasil yang akurat.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">3. Generasi Rekomendasi</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Berdasarkan analisis yang dilakukan, sistem menghasilkan rekomendasi paket yang personal 
                  untuk setiap pelanggan. Rekomendasi ini disesuaikan dengan profil, preferensi, dan pola 
                  penggunaan pelanggan untuk meningkatkan kemungkinan konversi.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">4. Continuous Learning</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Sistem terus belajar dari feedback dan interaksi pelanggan untuk meningkatkan akurasi 
                  rekomendasi. Setiap kali pelanggan berinteraksi dengan rekomendasi, sistem memperbarui 
                  modelnya untuk memberikan hasil yang lebih baik di masa depan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in-up delay-200 tracking-tight">
              Manfaat Menggunakan Telvora Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2 tracking-tight">Meningkatkan Retensi Pelanggan</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Identifikasi pelanggan yang berisiko churn lebih awal dan ambil tindakan preventif untuk 
                  mempertahankan mereka dengan rekomendasi yang tepat.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2 tracking-tight">Meningkatkan Konversi Penjualan</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Rekomendasi yang personal dan tepat sasaran meningkatkan kemungkinan pelanggan untuk 
                  membeli paket yang direkomendasikan.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2 tracking-tight">Optimasi Operasional</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Dashboard analitik yang komprehensif membantu Anda mengoptimalkan operasional bisnis 
                  dengan insight yang actionable.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f1727] border border-slate-200 dark:border-[#1e2a3d] rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2 tracking-tight">Pengambilan Keputusan Data-Driven</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  Semua keputusan strategis didukung oleh data yang akurat dan analisis yang mendalam, 
                  mengurangi risiko dan meningkatkan keberhasilan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
              Fitur Utama Sistem
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Solusi lengkap untuk mengoptimalkan operasional dan meningkatkan kepuasan pelanggan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                    className="flex flex-col h-full border border-slate-200 dark:border-[#1e2a3d] bg-slate-50 dark:bg-[#0f1727] shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="inline-flex p-4 rounded-2xl bg-slate-100 dark:bg-[#182338] text-sky-600 dark:text-sky-300 mb-4 animate-float-soft">
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
              Kemampuan Sistem
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Teknologi canggih yang mendukung performa optimal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <Card
                  key={index}
                    className="flex flex-col h-full border border-slate-200 dark:border-[#1e2a3d] bg-slate-50 dark:bg-[#0f1727] shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="inline-flex p-3 rounded-xl bg-slate-100 dark:bg-[#182338] text-sky-600 dark:text-sky-300 mb-4 animate-float-soft">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg md:text-xl text-slate-900 dark:text-white">{capability.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-700 dark:text-slate-300">
                      {capability.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="border border-slate-200 dark:border-[#1e2a3d] bg-slate-50 dark:bg-[#0f1727] shadow-sm hover:shadow-xl transition-all duration-300 ease-out max-w-4xl mx-auto animate-fade-in-up">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Siap Memulai?
              </CardTitle>
              <CardDescription className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400">
                Login ke dashboard untuk mulai menggunakan Telvora Analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base px-8 py-6 h-auto rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 active:translate-y-0"
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
                className="border border-slate-700 bg-slate-800/30 text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-slate-600 font-semibold text-base px-8 py-6 h-auto rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default TentangSistem

