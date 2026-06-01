import React from 'react'
import ReviewSection from '../components/core/HomePage/ReviewSection'
import TurfsSection from '../components/core/HomePage/TurfsSection'
import HomeSlider from '../components/core/HomePage/HomeSlider'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className='bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300'
    >
      <HomeSlider></HomeSlider>
      <div className='max-w-7xl mx-auto mt-12'>
        <TurfsSection></TurfsSection>
        <ReviewSection></ReviewSection>
      </div>
    </motion.div>
  )
}
