'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Features() {
  const features = [
    {
      title: "AI Health Assistant",
      description: "Get instant, reliable answers to your health questions in multiple languages.",
      icon: "🤖",
      color: "teal"
    },
    {
      title: "Period Tracking",
      description: "Track your menstrual cycle with ease and get personalized insights.",
      icon: "📅",
      color: "purple"
    },
    {
      title: "Pregnancy Journey",
      description: "Comprehensive pregnancy tracking with appointment management.",
      icon: "👶",
      color: "pink"
    },
    {
      title: "Emergency Support",
      description: "Quick access to emergency contacts and helplines in your location.",
      icon: "🆘",
      color: "red"
    },
    {
      title: "Health Education",
      description: "Access curated health articles and tips designed for women.",
      icon: "📚",
      color: "blue"
    },
    {
      title: "Community Support",
      description: "Connect with a supportive community for emotional and physical wellbeing.",
      icon: "👥",
      color: "green"
    }
  ]

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="features" className="py-20 bg-custom-background/50 dark:bg-custom-darkBg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-custom-text dark:text-custom-darkText">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-custom-text/80 dark:text-custom-darkText/80">
            Comprehensive features designed for your health journey
          </p>
        </motion.div>

        <div
          ref={ref}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 bg-white dark:bg-custom-darkBg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-tint-light/5 to-transparent dark:from-tint-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-3">
                  {feature.title}
                </h3>
                <p className="text-custom-text/70 dark:text-custom-darkText/70">
                  {feature.description}
                </p>
              </div>
              
              {/* Interactive hover effect */}
              <div className="absolute bottom-0 left-0 h-1 bg-tint-light dark:bg-tint-dark w-0 group-hover:w-full transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
