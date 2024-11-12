import { TappBanner } from '@/components/features/tapp/banner'
import { TappDetail } from '@/components/features/tapp/tapp-detail'
import { Header } from '@/components/header'

export default function Tapp() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <TappBanner />
      <TappDetail />
    </div>
  )
}
