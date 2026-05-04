'use client'

import { useState } from 'react'
import {
  ALL_FINANCIAL_INSTITUTIONS,
  CATEGORY_CONFIG,
  FORMAL_INSTITUTIONS_COUNT,
  TOTAL_FORMAL
} from '@/lib/financial-seed-data'
import { MapPin, Phone, Globe, Clock, Search, Filter, Map, Eye, Navigation, ExternalLink } from 'lucide-react'

export default function FinancialMapPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showInformal, setShowInformal] = useState(false)

  const filteredInstitutions = ALL_FINANCIAL_INSTITUTIONS.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inst.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || inst.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryCount = (cat: string) => {
    if (cat === 'all') return ALL_FINANCIAL_INSTITUTIONS.length
    return ALL_FINANCIAL_INSTITUTIONS.filter(i => i.category === cat).length
  }

  const getDirections = (inst: typeof ALL_FINANCIAL_INSTITUTIONS[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${inst.latitude},${inst.longitude}`
    window.open(url, '_blank')
  }

  const openStreetView = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps/@${latitude},${longitude},3d/data=!3m1!1e2`, '_blank')
  }

  const open360View = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps/place/${latitude},${longitude}/@${latitude},${longitude},15z/data=!4m2!6m1!1s0x0:0x0!8m2!3d${latitude}!4d${longitude}`, '_blank')
  }

  const openLiveView = () => {
    window.open(`https://www.google.com/maps/@13.4549,-16.5775,13z`, '_blank')
  }

  const openWhatsApp = (whatsapp?: string, name?: string) => {
    if (!whatsapp) return
    const num = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=Hi%20${encodeURIComponent(name || '')}%2C%20found%20you%20on%20FORTIS%20OS%20Financial%20Map`, '_blank')
  }

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const openWebsite = (url?: string) => {
    if (url) window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <span className="text-xl font-bold text-white">FORTIS OS</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/financial-map" className="text-emerald-400">Financial Map</a>
              <a href="/knowledge" className="text-slate-300 hover:text-white">Knowledge</a>
              <a href="/marketplace" className="text-slate-300 hover:text-white">Marketplace</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-white">
              🗺️ Gambia Financial Sector Map
            </h1>
            <p className="text-lg text-emerald-100">
              Complete directory of {TOTAL_FORMAL}+ financial institutions across all categories
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🏦 {FORMAL_INSTITUTIONS_COUNT.banks} Banks</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">💰 {FORMAL_INSTITUTIONS_COUNT.microfinance} Microfinance</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📱 {FORMAL_INSTITUTIONS_COUNT.mobile_money} Mobile Money</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🛡️ {FORMAL_INSTITUTIONS_COUNT.insurance} Insurance</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🏙️ Street View</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">👁️ 360° Panorama</span>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Categories ({getCategoryCount('all')})</option>
                <option value="bank">🏦 Banks ({getCategoryCount('bank')})</option>
                <option value="microfinance">💰 Microfinance ({getCategoryCount('microfinance')})</option>
                <option value="forex">💱 Forex Bureaux ({getCategoryCount('forex')})</option>
                <option value="mobile_money_agent">📱 Mobile Money ({getCategoryCount('mobile_money_agent')})</option>
                <option value="insurance">🛡️ Insurance ({getCategoryCount('insurance')})</option>
                <option value="credit_union">🤝 Credit Unions ({getCategoryCount('credit_union')})</option>
              </select>

              <button
                onClick={() => setShowInformal(!showInformal)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${
                  showInformal 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-500'
                }`}
              >
                <Filter className="h-4 w-4" />
                {showInformal ? '✓ Informal On' : 'Show Informal'}
              </button>
            </div>

            {/* Results */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInstitutions.map((inst, idx) => {
                const config = CATEGORY_CONFIG[inst.category as keyof typeof CATEGORY_CONFIG]
                return (
                  <div
                    key={`${inst.name}-${idx}`}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-5 transition-all hover:border-emerald-500/50"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: `${config?.color}20` }}
                      >
                        {config?.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">{inst.name}</h3>
                        <p className="text-xs text-slate-400">{config?.label}</p>
                      </div>
                    </div>

                    <div className="mb-3 space-y-2 text-sm text-slate-400">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                        <span>{inst.address}</span>
                      </p>
                      {inst.operating_hours && (
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-400" />
                          <span>{inst.operating_hours}</span>
                        </p>
                      )}
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {inst.services.slice(0, 4).map((service, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {inst.services.slice(0, 4).map((service, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => makeCall(inst.phone)}
                        className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs text-white hover:bg-blue-700"
                      >
                        <Phone className="h-3 w-3" /> Call
                      </button>
                      <button
                        onClick={() => getDirections(inst)}
                        className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs text-white hover:bg-emerald-700"
                      >
                        <Navigation className="h-3 w-3" /> Directions
                      </button>
                      {inst.website && (
                        <button
                          onClick={() => openWebsite(inst.website)}
                          className="flex items-center gap-1 rounded-md bg-purple-600 px-2.5 py-1.5 text-xs text-white hover:bg-purple-700"
                        >
                          <Globe className="h-3 w-3" /> Website
                        </button>
                      )}
                      <button
                        onClick={() => openStreetView(inst.latitude, inst.longitude)}
                        className="flex items-center gap-1 rounded-md bg-amber-600 px-2.5 py-1.5 text-xs text-white hover:bg-amber-700"
                        title="Street View"
                      >
                        <Map className="h-3 w-3" /> Street View
                      </button>
                      <button
                        onClick={() => open360View(inst.latitude, inst.longitude)}
                        className="flex items-center gap-1 rounded-md bg-orange-600 px-2.5 py-1.5 text-xs text-white hover:bg-orange-700"
                        title="360° Panorama"
                      >
                        <Eye className="h-3 w-3" /> 360°
                      </button>
                      {inst.whatsapp && (
                        <button
                          onClick={() => openWhatsApp(inst.whatsapp, inst.name)}
                          className="flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1.5 text-xs text-white hover:bg-green-700"
                          title="WhatsApp"
                        >
                          💬 WhatsApp
                        </button>
                      )}
                    </div>

                    {/* Live View Button at bottom */}
                    <button
                      onClick={openLiveView}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-slate-600 bg-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
                    >
                      <ExternalLink className="h-3 w-3" /> 🗺️ Open Live Map View
                    </button>
                  </div>
                )
              })}
            </div>

            {filteredInstitutions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-slate-400">No institutions found matching your search.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}
                  className="mt-4 text-emerald-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>🗺️ First complete Gambian financial sector map — Formal + Informal institutions</p>
        </div>
      </footer>
    </div>
  )
}