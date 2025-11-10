import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CMSLayout from './components/CMSLayout'
import Dashboard from './pages/CMS/Dashboard'
import Packages from './pages/CMS/Packages'
import Customers from './pages/CMS/Customers'
import Recommendations from './pages/CMS/Recommendations'
import Settings from './pages/CMS/Settings'
import './styles/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cms" element={<CMSLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="packages" element={<Packages />} />
          <Route path="customers" element={<Customers />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App






