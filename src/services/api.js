// API Service Layer - Supabase Integration
// Uses Supabase directly for all data operations

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Agentic inference service
const RECSYS_BASE_URL = import.meta.env.VITE_RECSYS_URL || 'http://localhost:8000'

// ============================================
// DASHBOARD STATS
// ============================================
export const getDashboardStats = async () => {
  if (!isSupabaseConfigured) {
    return {
      totalCustomers: 0,
      totalPackages: 0,
      totalRevenue: 0,
      churnRate: 8.5,
      mlAccuracy: 94.5,
    }
  }

  try {
    // Get total customers - coba customer_profile dulu, jika tidak ada coba customers
    let totalCustomers = 0
    let customerTable = 'customer_profile'
    const { count: count1, error: err1 } = await supabase
      .from('customer_profile')
      .select('*', { count: 'exact', head: true })
    
    if (err1) {
      // Coba tabel customers sebagai fallback
      const { count: count2 } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
      totalCustomers = count2 || 0
      customerTable = 'customers'
    } else {
      totalCustomers = count1 || 0
    }

    // Get total packages - coba product_catalog dulu, jika tidak ada coba packages
    let totalPackages = 0
    let packageTable = 'product_catalog'
    const { count: count3, error: err3 } = await supabase
      .from('product_catalog')
      .select('*', { count: 'exact', head: true })
    
    if (err3) {
      // Coba tabel packages sebagai fallback
      const { count: count4 } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
      totalPackages = count4 || 0
      packageTable = 'packages'
    } else {
      totalPackages = count3 || 0
    }

    // Get total revenue - coba monthly_spend dari customer_profile
    let totalRevenue = 0
    const { data: revenue } = await supabase
      .from(customerTable)
      .select('monthly_spend')
      .not('monthly_spend', 'is', null)

    if (revenue && revenue.length > 0) {
      totalRevenue = revenue.reduce((sum, item) => sum + (parseFloat(item.monthly_spend) || 0), 0) * 12 // Convert monthly to annual
    }

    // Recommendations tidak ada di database, skip

    // Calculate churn rate from customer_profile if available
    let churnRate = 8.5
    if (customerTable === 'customer_profile') {
      try {
        const { data: customers, error: churnError } = await supabase
          .from('customer_profile')
          .select('complaint_count, target_offer')
        
        if (!churnError && customers && customers.length > 0) {
          const highRisk = customers.filter(c => 
            (c.complaint_count && c.complaint_count > 2) || 
            c.target_offer === 'churn_prevention'
          ).length
          churnRate = (highRisk / customers.length) * 100
        }
      } catch (err) {
        // Gunakan default churn rate jika error
        console.warn('Error calculating churn rate:', err)
      }
    }

    return {
      totalCustomers: totalCustomers || 0,
      totalPackages: totalPackages || 0,
      totalRevenue: totalRevenue,
      churnRate: churnRate || 8.5,
      mlAccuracy: 94.5,
      annualContractValue: totalRevenue, // Alias for compatibility
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return default values jika error, jangan return null
    return {
      totalCustomers: 0,
      totalPackages: 0,
      totalRevenue: 0,
      churnRate: 8.5,
      mlAccuracy: 94.5,
      annualContractValue: 0,
    }
  }
}

// ============================================
// CUSTOMERS
// ============================================
export const getCustomers = async (filters = {}) => {
  try {
    if (!isSupabaseConfigured) return []

    // Fetch all customers using pagination (no limit)
    let allCustomers = []
    let page = 0
    const pageSize = 1000
    let hasMore = true
    let tableName = 'customer_profile'

    while (hasMore) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('customer_id', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) {
        // Try fallback to 'customers' table only on first page
        if (page === 0) {
          tableName = 'customers'
          const fallbackResult = await supabase
            .from(tableName)
            .select('*')
            .order('customer_id', { ascending: true })
            .range(0, pageSize - 1)
          
          if (fallbackResult.error) {
            console.error('Error fetching customers:', fallbackResult.error)
            return []
          }
          
          if (fallbackResult.data && fallbackResult.data.length > 0) {
            allCustomers = [...allCustomers, ...fallbackResult.data]
            page++
            if (fallbackResult.data.length < pageSize) {
              hasMore = false
            }
          } else {
            hasMore = false
          }
        } else {
          console.error('Error fetching customers:', error)
          hasMore = false
        }
      } else {
        if (data && data.length > 0) {
          allCustomers = [...allCustomers, ...data]
          page++
          // If we got less than pageSize, we've reached the end
          if (data.length < pageSize) {
            hasMore = false
          }
        } else {
          hasMore = false
        }
      }
    }

    let data = allCustomers

    if (!data || data.length === 0) {
      console.log('No customers found')
      return []
    }

    // Map data dari customer_profile ke format yang digunakan UI
    let mappedData = (data || []).map(item => {
      // Hitung churn risk dari complaint_count dan target_offer
      let churnRate = 0
      if (item.complaint_count && item.complaint_count > 2) {
        churnRate = 75
      } else if (item.complaint_count && item.complaint_count > 0) {
        churnRate = 45
      } else if (item.target_offer === 'churn_prevention') {
        churnRate = 80
      } else {
        churnRate = 20
      }

      return {
        id: item.customer_id,
        customerId: item.customer_id,
        planType: item.plan_type || 'N/A',
        device: item.device_brand || 'N/A',
        dataUsage: parseFloat(item.avg_data_usage_gb) || 0,
        videoPercentage: ((parseFloat(item.pct_video_usage) || 0) * 100).toFixed(1),
        callMinutes: parseFloat(item.avg_call_duration) || 0,
        smsCount: parseInt(item.sms_freq) || 0,
        totalSpend: parseFloat(item.monthly_spend) || 0,
        topupAmount: 0, // Tidak ada di schema
        complaintCount: parseInt(item.complaint_count) || 0,
        churnRate: churnRate,
        targetOffer: item.target_offer || '',
        travelScore: parseFloat(item.travel_score) || 0,
        topupFreq: parseInt(item.topup_freq) || 0,
        // Keep original data for compatibility
        ...item
      }
    })

    // Apply filters
    if (filters.search) {
      mappedData = mappedData.filter(item => {
        const search = filters.search.toLowerCase()
        return (
          item.customerId?.toLowerCase().includes(search) ||
          item.planType?.toLowerCase().includes(search) ||
          item.device?.toLowerCase().includes(search)
        )
      })
    }
    if (filters.risk_level) {
      mappedData = mappedData.filter(item => {
        if (item.churnRate > 70) return filters.risk_level === 'Tinggi'
        if (item.churnRate > 40) return filters.risk_level === 'Sedang'
        return filters.risk_level === 'Rendah'
      })
    }
    if (filters.status) {
      mappedData = mappedData.filter(item => {
        const status = item.status || 'active'
        return status === filters.status
      })
    }

    return mappedData
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

export const getCustomerById = async (id) => {
  try {
    if (!isSupabaseConfigured) return null

    // Coba customer_profile dulu
    let { data, error } = await supabase
      .from('customer_profile')
      .select('*')
      .eq('customer_id', id)
      .single()

    if (error) {
      // Fallback ke tabel customers
      const result = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()
      data = result.data
      error = result.error
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

export const createCustomer = async (customer) => {
  try {
    if (!isSupabaseConfigured) return null

    // Gunakan customer_profile
    const { data, error } = await supabase
      .from('customer_profile')
      .insert([customer])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error creating customer:', error)
    return null
  }
}

export const updateCustomer = async (id, customer) => {
  try {
    if (!isSupabaseConfigured) return null

    // Gunakan customer_profile
    const { data, error } = await supabase
      .from('customer_profile')
      .update(customer)
      .eq('customer_id', id)
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error updating customer:', error)
    return null
  }
}

export const deleteCustomer = async (id) => {
  try {
    if (!isSupabaseConfigured) return false

    // Gunakan customer_profile
    const { error } = await supabase
      .from('customer_profile')
      .delete()
      .eq('customer_id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting customer:', error)
    return false
  }
}

// ============================================
// CUSTOMER INSIGHTS (Agentic Recsys + Churn)
// ============================================
export const getCustomerInsights = async (customerId, topN = 5) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  const fallback = {
    recommendations: {
      items: [
        {
          product_name: 'Combo Hemat 15GB + 300Menit 30 Hari',
          category: 'Combo',
          price: 15666,
          duration_days: 30,
          reasons: ['Rekomendasi Utama (Combo Value Terbaik/Termurah): Sesuai prediksi model: General Offer'],
        },
        {
          product_name: 'Combo Hemat 25GB + 300Menit 30 Hari',
          category: 'Combo',
          price: 16062,
          duration_days: 30,
          reasons: ['Rekomendasi Utama (Combo Value Terbaik/Termurah): Sesuai prediksi model: General Offer'],
        },
        {
          product_name: 'Combo Spesial 12GB + 300Menit 30 Hari',
          category: 'Combo',
          price: 17125,
          duration_days: 30,
          reasons: ['Rekomendasi Utama (Combo Value Terbaik/Termurah): Sesuai prediksi model: General Offer'],
        },
        {
          product_name: 'Paket Voice Unlimited 7 Hari',
          category: 'Voice',
          price: 17000,
          duration_days: 7,
          reasons: ['Rekomendasi Sekunder Voice - Paket pendek sesuai profil'],
        },
        {
          product_name: 'Roaming USA Pass 250MB 7 Hari',
          category: 'Roaming',
          price: 7635,
          duration_days: 7,
          reasons: ['Rekomendasi Sekunder Roaming - Paket pendek sesuai profil'],
        },
      ],
    },
    churn: {
      probability: 0.0,
      label: 'low',
      raw_label: 'General Offer',
    },
    ai_insights: {
      product_recommendation:
        'Berdasarkan kebutuhan Anda, kami merekomendasikan paket Combo Hemat dan Spesial yang menawarkan kuota data dan menit panggilan sesuai dengan penggunaan bulanan Anda. Dengan memilih salah satu paket ini, Anda dapat menikmati koneksi internet yang ngebut dan komunikasi yang jernih, bahkan akan mendapatkan tambahan menit dan kuota aplikasi favorit. Paket ini merupakan solusi lengkap tanpa yang bikin kantong bolong – pilih paket Combo yang paling sesuai dengan gaya hidup digital Anda sekarang!',
      churn_analysis:
        'Probabilitas churn rendah didukung oleh frekuensi komplain yang rendah dan pengeluaran bulanan yang moderat, namun travel score yang cukup tinggi menunjukkan potensi kebutuhan roaming atau data internasional yang belum terpenuhi. Perhatikan tren travel score di bulan-bulan mendatang dan tawarkan paket roaming/data yang relevan berdasarkan kategori prediksi "General Offer" untuk meningkatkan loyalitas.',
    },
    user_category: 'General Offer',
  }

  try {
    const res = await fetch(`${RECSYS_BASE_URL}/infer/analytic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, top_n: topN }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      console.warn('Recsys service returned non-OK, using fallback')
      return fallback
    }
    const data = await res.json()
    return data || fallback
  } catch (error) {
    console.error('Error fetching customer insights, using fallback:', error)
    return fallback
  } finally {
    clearTimeout(timeout)
  }
}

// Simulate Product Impact using ML Model
export const simulateProductImpact = async (productData) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout for simulation

  try {
    const res = await fetch(`${RECSYS_BASE_URL}/infer/simulate-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_name: productData.productName,
        category: productData.category,
        price: parseFloat(productData.price),
        duration_days: parseInt(productData.duration) || 30
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    
    if (!res.ok) {
      throw new Error(`Simulation failed: ${res.statusText}`)
    }
    
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error simulating product:', error)
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

// ============================================
// PACKAGES / PRODUCTS
// ============================================
export const getPackages = async (filters = {}) => {
  try {
    if (!isSupabaseConfigured) return []

    // Gunakan product_catalog dengan limit 1000
    let query = supabase
      .from('product_catalog')
      .select('*')
      .limit(1000)
    
    let { data, error } = await query
    
    if (error) {
      // Fallback ke tabel packages
      query = supabase.from('packages').select('*').limit(1000)
      const result = await query
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error fetching packages:', error)
      return []
    }

    // Map data dari product_catalog ke format yang digunakan UI
    let mappedData = (data || []).map(item => ({
      id: item.product_id,
      productId: item.product_id,
      productName: item.product_name || 'N/A',
      name: item.product_name || 'N/A',
      description: item.description || '',
      category: item.category || 'Data',
      price: parseFloat(item.price) || 0,
      duration: parseInt(item.duration_days) || 30,
      durationDays: parseInt(item.duration_days) || 30,
      dataCapacity: parseFloat(item.product_capacity_gb) || 0,
      minutes: parseFloat(item.product_capacity_minutes) || 0,
      sms: parseFloat(item.product_capacity_sms) || 0,
      vodCapacity: parseFloat(item.product_capacity_vod) || 0,
      // Keep original data for compatibility
      ...item
    }))

    // Apply filters
    if (filters.search) {
      mappedData = mappedData.filter(item => {
        const search = filters.search.toLowerCase()
        return (
          item.productName?.toLowerCase().includes(search) ||
          item.productId?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.category?.toLowerCase().includes(search)
        )
      })
    }
    if (filters.category) {
      mappedData = mappedData.filter(item => {
        const cat = item.category || ''
        return cat === filters.category
      })
    }

    return mappedData
  } catch (error) {
    console.error('Error fetching packages:', error)
    return []
  }
}

export const getPackageById = async (id) => {
  try {
    if (!isSupabaseConfigured) return null

    // Coba product_catalog dulu
    let { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .eq('product_id', id)
      .single()

    if (error) {
      // Fallback ke packages
      const result = await supabase
        .from('packages')
        .select('*')
        .eq('package_id', id)
        .single()
      data = result.data
      error = result.error
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching package:', error)
    return null
  }
}

export const createPackage = async (pkg) => {
  try {
    if (!isSupabaseConfigured) return null

    // Map dari format UI ke format database product_catalog
    const dbData = {
      product_id: pkg.productId || `PRD${Date.now()}`,
      product_name: pkg.productName || pkg.name || '',
      description: pkg.description || '',
      category: pkg.category || 'Data',
      price: parseFloat(pkg.price) || 0,
      duration_days: parseInt(pkg.duration || pkg.durationDays) || 30,
      product_capacity_gb: parseFloat(pkg.dataCapacity) || 0,
      product_capacity_minutes: parseFloat(pkg.minutes) || 0,
      product_capacity_sms: parseFloat(pkg.sms) || 0,
      product_capacity_vod: parseFloat(pkg.vodCapacity) || 0,
    }

    // Gunakan product_catalog
    const { data, error } = await supabase
      .from('product_catalog')
      .insert([dbData])
      .select()

    if (error) throw error
    
    // Map kembali ke format UI
    const result = data?.[0]
    if (result) {
      return {
        id: result.product_id,
        productId: result.product_id,
        productName: result.product_name,
        name: result.product_name,
        description: result.description,
        category: result.category,
        price: parseFloat(result.price) || 0,
        duration: parseInt(result.duration_days) || 30,
        dataCapacity: parseFloat(result.product_capacity_gb) || 0,
        minutes: parseFloat(result.product_capacity_minutes) || 0,
        sms: parseFloat(result.product_capacity_sms) || 0,
        vodCapacity: parseFloat(result.product_capacity_vod) || 0,
        ...result
      }
    }
    return null
  } catch (error) {
    console.error('Error creating package:', error)
    return null
  }
}

export const updatePackage = async (id, pkg) => {
  try {
    if (!isSupabaseConfigured) return null

    // Map dari format UI ke format database product_catalog
    const dbData = {
      product_name: pkg.productName || pkg.name,
      description: pkg.description,
      category: pkg.category,
      price: parseFloat(pkg.price) || 0,
      duration_days: parseInt(pkg.duration || pkg.durationDays) || 30,
      product_capacity_gb: parseFloat(pkg.dataCapacity) || 0,
      product_capacity_minutes: parseFloat(pkg.minutes) || 0,
      product_capacity_sms: parseFloat(pkg.sms) || 0,
      product_capacity_vod: parseFloat(pkg.vodCapacity) || 0,
    }

    // Gunakan product_catalog
    const { data, error } = await supabase
      .from('product_catalog')
      .update(dbData)
      .eq('product_id', id)
      .select()

    if (error) throw error
    
    // Map kembali ke format UI
    const result = data?.[0]
    if (result) {
      return {
        id: result.product_id,
        productId: result.product_id,
        productName: result.product_name,
        name: result.product_name,
        description: result.description,
        category: result.category,
        price: parseFloat(result.price) || 0,
        duration: parseInt(result.duration_days) || 30,
        dataCapacity: parseFloat(result.product_capacity_gb) || 0,
        minutes: parseFloat(result.product_capacity_minutes) || 0,
        sms: parseFloat(result.product_capacity_sms) || 0,
        vodCapacity: parseFloat(result.product_capacity_vod) || 0,
        ...result
      }
    }
    return null
  } catch (error) {
    console.error('Error updating package:', error)
    return null
  }
}

export const deletePackage = async (id) => {
  try {
    if (!isSupabaseConfigured) return false

    // Gunakan product_catalog
    const { error } = await supabase
      .from('product_catalog')
      .delete()
      .eq('product_id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}

// ============================================
// RECOMMENDATIONS
// Tabel recommendations tidak ada di database, return empty
// ============================================
export const getRecommendations = async (filters = {}) => {
  // Tabel recommendations tidak ada di Supabase
  return []
}

export const updateRecommendationStatus = async (id, status) => {
  // Tabel recommendations tidak ada di Supabase
  return null
}

export const createRecommendation = async (recommendation) => {
  // Tabel recommendations tidak ada di Supabase
  return null
}

// ============================================
// ANALYTICS – CHURN COMPOSITION
// ============================================
export const getChurnComposition = async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout (looping 10k users)

  const fallback = {
    total_users: 10000,
    composition: {
      high: { count: 850, percentage: 8.5 },
      medium: { count: 4500, percentage: 45.0 },
      low: { count: 4650, percentage: 46.5 }
    },
    churn_rate: 8.5,
    revenue_at_risk: 123456789,
    generated_at: new Date().toISOString()
  }

  try {
    const res = await fetch(`${RECSYS_BASE_URL}/analytics/churn-composition`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`⚠️ Churn composition API returned status ${res.status}, using fallback`)
      return fallback
    }

    const data = await res.json()
    return data || fallback
  } catch (error) {
    console.error('Error fetching churn composition, using fallback:', error)
    return fallback
  } finally {
    clearTimeout(timeout)
  }
}

// ============================================
// ANALYTICS
// ============================================
export const getAnalytics = async () => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const res = await fetch(`${RECSYS_BASE_URL}/analytics/overview`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Analytics fetch failed: ${res.statusText}`)

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return null
  }
}

// ============================================
// PRODUCT SIMULATIONS (Product Lab)
// ============================================
export const saveProductSimulation = async (simulationData) => {
  try {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, simulation not saved')
      return null
    }

    const simulationRecord = {
      product_name: simulationData.productName || '',
      category: simulationData.category || '',
      price: parseFloat(simulationData.price) || 0,
      duration_days: parseInt(simulationData.duration) || 30,
      data_capacity_gb: parseFloat(simulationData.dataCapacity) || 0,
      minutes: parseFloat(simulationData.minutes) || 0,
      sms: parseFloat(simulationData.sms) || 0,
      vod_capacity_gb: parseFloat(simulationData.vodCapacity) || 0,
      match_score: simulationData.matchScore || 0,
      estimated_recommendations: simulationData.estimatedRecommendations || 0,
      conversion_rate: simulationData.conversionRate || 0,
      price_segment: simulationData.priceSegment || '',
      target_users: JSON.stringify(simulationData.targetUsers || []),
      recommendation: simulationData.recommendation || '',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('product_simulations')
      .insert([simulationRecord])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving product simulation:', error)
    return null
  }
}

export const getProductSimulations = async (filters = {}) => {
  try {
    if (!isSupabaseConfigured) return []

    let query = supabase
      .from('product_simulations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.date) {
      // Filter by date (YYYY-MM-DD format)
      const startDate = new Date(filters.date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(filters.date)
      endDate.setHours(23, 59, 59, 999)
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching simulations:', error)
      return []
    }

    // Map data to UI format
    return (data || []).map(item => ({
      id: item.id,
      productName: item.product_name,
      category: item.category,
      price: item.price,
      duration: item.duration_days,
      dataCapacity: item.data_capacity_gb,
      minutes: item.minutes,
      sms: item.sms,
      vodCapacity: item.vod_capacity_gb,
      matchScore: item.match_score,
      estimatedRecommendations: item.estimated_recommendations,
      conversionRate: item.conversion_rate,
      priceSegment: item.price_segment,
      targetUsers: typeof item.target_users === 'string' ? JSON.parse(item.target_users) : item.target_users,
      recommendation: item.recommendation,
      createdAt: item.created_at,
      ...item
    }))
  } catch (error) {
    console.error('Error fetching product simulations:', error)
    return []
  }
}

export const deleteProductSimulation = async (id) => {
  try {
    if (!isSupabaseConfigured) return false

    const { error } = await supabase
      .from('product_simulations')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting simulation:', error)
    return false
  }
}

export default {
  getDashboardStats,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getRecommendations,
  createRecommendation,
  updateRecommendationStatus,
  getAnalytics,
  saveProductSimulation,
  getProductSimulations,
  deleteProductSimulation,
}

