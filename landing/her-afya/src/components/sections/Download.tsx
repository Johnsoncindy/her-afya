'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Download() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section 
      id="download" 
      className="py-12 sm:py-16 lg:py-20 bg-tint-light dark:bg-tint-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Get Started Today
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of women taking control of their health journey
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-6"
          >
            <motion.a 
              href="#" 
              aria-label="Download on the App Store" 
              className="inline-block transform hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/images/apple_badge.svg"
                alt="Download on the App Store"
                width={200}
                height={60}
                className="h-[60px] w-auto"
              />
            </motion.a>
            <motion.a 
              href="#" 
              aria-label="Get it on Google Play" 
              className="inline-block transform hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/images/play_badge.png"
                alt="Get it on Google Play"
                width={200}
                height={60}
                className="h-[60px] w-auto"
              />
            </motion.a>
          </motion.div>

          {/* Optional: Add floating elements for visual interest */}
          <div className="relative mt-12">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute -top-8 left-1/4 w-20 h-20 opacity-10"
            >
              <Image
                src="/images/app-icon.png"
                alt=""
                width={80}
                height={80}
                className="rounded-2xl"
              />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -top-12 right-1/4 w-16 h-16 opacity-10"
            >
              <Image
                src="/images/app-icon.png"
                alt=""
                width={64}
                height={64}
                className="rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
