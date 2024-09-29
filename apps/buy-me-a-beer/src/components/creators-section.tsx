/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export function CreatorsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Popular Creators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={`https://g-7rzs8lh0toh.vusercontent.net/placeholder.svg?height=200&width=400`}
                alt={`Creator ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Creator {i}</h3>
                <p className="text-gray-600 mb-4">
                  Creating amazing content and inspiring others every day.
                </p>
                <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors">
                  Buy a Beer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
