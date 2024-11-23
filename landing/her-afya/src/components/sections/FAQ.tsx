'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search, HelpCircle } from 'lucide-react'

type FAQItem = {
  category: string
  question: string
  answer: string
}

const faqs: { category: string; items: FAQItem[] }[] = [
  {
    category: "Getting Started",
    items: [
      {
        category: "Getting Started",
        question: "How do I create an account?",
        answer: "Creating an account is simple! Just download the app and sign in with your Google account. We'll guide you through a quick setup process to personalize your experience."
      },
      {
        category: "Getting Started",
        question: "Is the app free to use?",
        answer: "Yes, HerAfya is completely free to use! We believe in making health technology accessible to everyone."
      }
    ]
  },
  {
    category: "Features & Usage",
    items: [
      {
        category: "Features & Usage",
        question: "What languages does the AI Health Assistant support?",
        answer: "Our AI Health Assistant currently supports English, French, and Spanish, with more languages coming soon to serve our diverse community."
      },
      {
        category: "Features & Usage",
        question: "How accurate is the period tracking?",
        answer: "Our period tracking uses advanced algorithms to provide highly accurate predictions. The more consistently you log your cycles, the more accurate the predictions become."
      },
      {
        category: "Features & Usage",
        question: "Can I export my health data?",
        answer: "Yes! You can export your health data in PDF format from the settings menu. This is great for sharing information with healthcare providers."
      }
    ]
  },
  {
    category: "Privacy & Security",
    items: [
      {
        category: "Privacy & Security",
        question: "Is my health data secure?",
        answer: "Absolutely! We use industry-standard encryption to protect your data. Your information is stored securely and never shared without your explicit consent."
      },
      {
        category: "Privacy & Security",
        question: "Who can see my health information?",
        answer: "Only you can access your health information. We maintain strict privacy controls and do not share your personal data with third parties."
      }
    ]
  },
  {
    category: "Support",
    items: [
      {
        category: "Support",
        question: "What if I need help using the app?",
        answer: "We offer multiple support channels: in-app help guides, email support, and community forums. Our support team is always ready to assist you!"
      },
      {
        category: "Support",
        question: "How do I report a problem?",
        answer: "You can report issues through the app's 'Help & Support' section or email us directly at herafya93@gmail.com. We typically respond within 24 hours."
      }
    ]
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = (
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  })).filter(category => category.items.length > 0)

  return (
    <section className="py-20 bg-gradient-to-b from-custom-background to-custom-background/50 dark:from-custom-darkBg dark:to-custom-darkBg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block p-3 rounded-full bg-tint-light/10 dark:bg-tint-dark/10 text-tint-light dark:text-tint-dark mb-4">
            <HelpCircle size={28} />
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-custom-text dark:text-custom-darkText mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-custom-text/70 dark:text-custom-darkText/70 max-w-2xl mx-auto">
            Got questions? We've got answers! If you can't find what you're looking for, 
            our support team is always here to help.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-custom-text/50 dark:text-custom-darkText/50" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-custom-darkBg/50 
                         text-custom-text dark:text-custom-darkText border border-custom-text/10 
                         dark:border-custom-darkText/10 focus:outline-none focus:ring-2 
                         focus:ring-tint-light dark:focus:ring-tint-dark"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === 'all'
                ? 'bg-tint-light dark:bg-tint-dark text-white'
                : 'bg-custom-text/10 dark:bg-custom-darkText/10 text-custom-text dark:text-custom-darkText hover:bg-tint-light/10 dark:hover:bg-tint-dark/10'
              }`}
          >
            All
          </button>
          {faqs.map((category) => (
            <button
              key={category.category}
              onClick={() => setActiveCategory(category.category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === category.category
                  ? 'bg-tint-light dark:bg-tint-dark text-white'
                  : 'bg-custom-text/10 dark:bg-custom-darkText/10 text-custom-text dark:text-custom-darkText hover:bg-tint-light/10 dark:hover:bg-tint-dark/10'
                }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.map((category) => (
            <div key={category.category} className="mb-8">
              {category.items.map((faq, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => setOpenIndex(openIndex === `${category.category}-${index}` ? null : `${category.category}-${index}`)}
                    className="w-full flex items-center justify-between p-6 bg-white dark:bg-custom-darkBg/50 
                             rounded-2xl text-left transition-all hover:shadow-md group"
                  >
                    <span className="text-lg font-medium text-custom-text dark:text-custom-darkText pr-8">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 p-2 rounded-full bg-tint-light/10 dark:bg-tint-dark/10 
                                   text-tint-light dark:text-tint-dark group-hover:bg-tint-light 
                                   group-hover:text-white dark:group-hover:bg-tint-dark transition-colors">
                      {openIndex === `${category.category}-${index}` ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === `${category.category}-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-tint-light/5 dark:bg-tint-dark/5 rounded-2xl mt-2">
                          <p className="text-custom-text/80 dark:text-custom-darkText/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Still Have Questions Card */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-tint-light/10 dark:bg-tint-dark/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-4">
              Still Have Questions?
            </h3>
            <p className="text-custom-text/70 dark:text-custom-darkText/70 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <a
              href="mailto:herafya93@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-tint-light dark:bg-tint-dark 
                       text-white rounded-full hover:opacity-90 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
