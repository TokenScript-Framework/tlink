'use client'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Support Creators with a Virtual Beer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
        >
          Show your appreciation by buying your favorite creators a beer. Send
          USDT directly to their wallet.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
        >
          <input
            type="text"
            placeholder="Creator's username"
            className="px-6 py-3 w-full md:w-96 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button className="px-8 py-3 text-lg font-medium bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors flex items-center">
            Support <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
