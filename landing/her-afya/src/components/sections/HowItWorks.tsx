// src/components/sections/HowItWorks.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Download the App",
      description: "Get HerAfya from your preferred app store",
      icon: "📱",
      image: "/images/download-app.png"
    },
    {
      number: "02",
      title: "Sign in with Google",
      description: "Quick and secure sign-in process",
      icon: "🔐",
      image: "/images/google-signin.png"
    },
    {
      number: "03",
      title: "Enjoy the Features",
      description: "Access all health tracking and support features",
      icon: "✨",
      image: "/images/app-preview.png"
    }
  ]

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section 
      id="how-it-works" 
      className="py-20 bg-gradient-to-b from-custom-background to-white dark:from-custom-darkBg dark:to-custom-darkBg/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-custom-text dark:text-custom-darkText">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-custom-text/80 dark:text-custom-darkText/80">
            Get started with HerAfya in three simple steps
          </p>
        </motion.div>

        <div
          ref={ref}
          className="mt-16 relative"
        >
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tint-light/20 dark:bg-tint-dark/20 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step card */}
                <div className="bg-white dark:bg-custom-darkBg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Number badge */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-tint-light dark:bg-tint-dark text-white flex items-center justify-center font-bold">
                    {step.number}
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-2">
                      {step.title}
                    </h3>
                    <p className="text-custom-text/70 dark:text-custom-darkText/70">
                      {step.description}
                    </p>
                  </div>

                  {/* Image preview */}
                  <div className="mt-6 relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Connection arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-tint-light dark:text-tint-dark">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
