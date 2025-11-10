import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ProblemSolution from '../components/ProblemSolution'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import PackageRecommendations from '../components/PackageRecommendations'
import CallToAction from '../components/CallToAction'
import CustomerActions from '../components/CustomerActions'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <PackageRecommendations />
      <CallToAction />
      <CustomerActions />
      <Footer />
    </div>
  )
}

export default Home


