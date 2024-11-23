'use client'
import { motion } from 'framer-motion'
import { Heart, Lightbulb, Users, Globe } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Empathy",
      description: "Understanding the unique challenges faced by women and girls worldwide.",
      color: "rose"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Using technology to create impactful and sustainable solutions.",
      color: "amber"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working together to build a supportive and inclusive platform.",
      color: "emerald"
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making health technology accessible to everyone.",
      color: "blue"
    }
  ]

  return (
    <section id="about" className="py-20 overflow-hidden bg-gradient-to-b from-custom-background via-tint-light/5 to-custom-background dark:from-custom-darkBg dark:via-tint-dark/5 dark:to-custom-darkBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-tint-light dark:text-tint-dark font-semibold tracking-wider uppercase">
            Our Mission
          </span>
          <h2 className="mt-4 text-4xl font-bold text-custom-text dark:text-custom-darkText md:text-5xl">
            Empowering Women Through Technology
          </h2>
          <p className="mt-6 text-xl text-custom-text/70 dark:text-custom-darkText/70 max-w-3xl mx-auto">
            We're on a mission to make healthcare technology accessible, 
            intuitive, and empowering for women around the world.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-white dark:bg-custom-darkBg/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-${value.color}-100 dark:bg-${value.color}-900/20 
                              flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <value.icon className={`w-6 h-6 text-${value.color}-600 dark:text-${value.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-2">
                {value.title}
              </h3>
              <p className="text-custom-text/70 dark:text-custom-darkText/70">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "15+", label: "Countries" },
            { number: "24/7", label: "Support" },
            { number: "4.8★", label: "App Rating" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-tint-light dark:text-tint-dark mb-2">
                {stat.number}
              </div>
              <div className="text-custom-text/70 dark:text-custom-darkText/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
