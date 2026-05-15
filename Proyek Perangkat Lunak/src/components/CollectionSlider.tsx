"use client"

import { useTheme } from '@/components/providers/ThemeProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'

export const CollectionSlider = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  // Collection images from public/collection
  const collectionImages = [
    '/collection/62shots_so.png',
    '/collection/356shots_so.png',
    '/collection/400shots_so.png',
    '/collection/554shots_so.png',
    '/collection/594shots_so.png',
    '/collection/632shots_so.png',
    '/collection/635shots_so.png',
    '/collection/767shots_so.png'
  ]

  // Auto-slide effect
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === collectionImages.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [collectionImages.length])

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? collectionImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === collectionImages.length - 1 ? 0 : prev + 1))
  }

  // Calculate slide position
  const calculateSlidePosition = () => {
    const offset = currentSlide * 100
    return `translateX(-${offset}%)`
  }

  if (!mounted) return null

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
      <div className="text-center mb-16">
        <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {language === 'id' ? 'Koleksi Fitur Kami' : 'Our Feature Collection'}
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {language === 'id' ? 'Jelajahi berbagai fitur yang membuat manajemen tugas Anda lebih mudah dan efisien.' : 'Explore the features that make your task management easier and more efficient.'}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: calculateSlidePosition() }}>
          {collectionImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={image}
                alt={`Collection ${index + 1}`}
                className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] object-cover rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" strokeWidth={2} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" strokeWidth={2} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {collectionImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300 dark:bg-gray-700'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}