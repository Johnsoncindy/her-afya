'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react'

type Testimonial = {
  id: number
  name: string
  location: string
  image: string
  text: string
  rating: number
  tag: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Monrovia",
    image: "/images/testimonials/sarah.jpg", // You can replace with default avatar if no image
    text: "HerAfya has transformed how I manage my health. The period tracking is incredibly accurate, and the health tips are so helpful!",
    rating: 5,
    tag: "Period Tracking"
  },
  {
    id: 2,
    name: "Marie Cooper",
    location: "Buchanan",
    image: "/images/testimonials/marie.jpg",
    text: "The pregnancy journey feature has been my constant companion. I love how it keeps track of all my appointments and milestones.",
    rating: 5,
    tag: "Pregnancy Journey"
  },
  {
    id: 3,
    name: "Grace Williams",
    location: "Gbarnga",
    image: "/images/testimonials/grace.avif",
    text: "Being able to chat with the AI health assistant in my local language has been incredible. It's like having a doctor available 24/7!",
    rating: 5,
    tag: "AI Assistant"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-custom-background via-custom-background to-custom-background/50 dark:from-custom-darkBg dark:via-custom-darkBg dark:to-custom-darkBg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-custom-text dark:text-custom-darkText">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-custom-text/70 dark:text-custom-darkText/70">
            Join thousands of satisfied users who trust HerAfya
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white dark:bg-custom-darkBg rounded-2xl shadow-xl p-8 md:p-12">
                <div className="absolute -top-4 right-8 text-tint-light dark:text-tint-dark">
                  <Quote size={48} className="opacity-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Image and Rating */}
                  <div className="text-center md:text-left">
                    <div className="relative w-24 h-24 mx-auto md:mx-0 mb-4">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-tint-light dark:bg-tint-dark text-white px-3 py-1 rounded-full text-sm">
                        {testimonials[currentIndex].tag}
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className="fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div>
                    <blockquote className="text-lg text-custom-text dark:text-custom-darkText mb-4">
                      "{testimonials[currentIndex].text}"
                    </blockquote>
                    <div className="font-semibold text-custom-text dark:text-custom-darkText">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-custom-text/70 dark:text-custom-darkText/70">
                      {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-white dark:bg-custom-darkBg shadow-md hover:bg-tint-light/5 dark:hover:bg-tint-dark/5"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-6 h-6 text-custom-text dark:text-custom-darkText" />
            </button>
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-tint-light dark:bg-tint-dark'
                      : 'bg-tint-light/30 dark:bg-tint-dark/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white dark:bg-custom-darkBg shadow-md hover:bg-tint-light/5 dark:hover:bg-tint-dark/5"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-6 h-6 text-custom-text dark:text-custom-darkText" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
