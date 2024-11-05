'use client'

import { TlinkCard } from '@/components/tlink-card'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { tlinks } from '@/lib/constants'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Download, Twitter } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    title: 'Install the extension',
    description: 'Get started by adding Tlink to your browser',
    icon: Download,
  },
  {
    title: 'Open a tweet with TokenScript Viewer link',
    description: 'Start exploring tokenized content',
    icon: Twitter,
  },
]

export function LandingContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-400"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Tlink
            </span>
          </Link>
          <ConnectButton showBalance={false} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600">
            Tlink Explorer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Dive into the future of decentralized networks with our cutting-edge
            explorer
          </p>
        </motion.div>

        <div className="columns-1 md:columns-3 gap-4 space-y-4 mt-4">
          {tlinks.map((tlink, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TlinkCard url={tlink.link} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            How to use Tlink
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.2 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mb-4">
                      {step.icon && (
                        <step.icon className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2 text-gray-100">
                      Step {i + 1}
                    </CardTitle>
                    <CardTitle className="text-xl mb-2 text-gray-100">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {step.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
