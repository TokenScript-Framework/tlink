'use client'

import { InstallButton } from '@/components/features/home/install-button'
import { Header } from '@/components/header'
import { TlinkCard } from '@/components/tlink-card'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { tlinks } from '@/lib/constants'
import { motion } from 'framer-motion'
import { Download, Twitter } from 'lucide-react'

const steps = [
  {
    title: 'Install the extension',
    description: 'Get started by adding Tlink to your browser',
    icon: Download,
  },
  {
    title: 'Open a tweet with tlink',
    description: 'Start exploring tapp right in your timeline',
    icon: Twitter,
  },
]

export function LandingContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

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
            Experience Web3 on Twitter, Telegram and Farcaster. Install the
            Tlink browser extension to interact with web3 today.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center my-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <InstallButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            Tlink Showcase
          </h2>
        </motion.div>

        <div className="columns-1 xl:columns-3 lg:columns-2 gap-4 space-y-4 mt-4">
          {tlinks.map((tlink, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TlinkCard url={tlink.link} twitter={tlink.twitter} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center my-12"
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

      <Cta />
    </div>
  )
}

function Cta() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Start using Tlink today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-300">
            Experience Web3 on Twitter, Telegram and Farcaster. Install the
            Tlink browser extension to interact with web3 today.
          </p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <InstallButton />
          </motion.div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
