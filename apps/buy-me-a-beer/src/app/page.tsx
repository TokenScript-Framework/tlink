import { CreatorsSection } from '@/components/creators-section'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { UsageSection } from '@/components/usage-section'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <UsageSection />
        <CreatorsSection />
      </main>
      <Footer />
    </div>
  )
}
