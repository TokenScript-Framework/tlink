import { LandingContent } from '@/components/features/home/landing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

export default function Home() {
  return <LandingContent />
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <main className="max-w-3xl mx-auto pt-16 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Tlink</h1>

        <Card>
          <CardHeader>
            <CardTitle>How to use Tlink</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
              <p>Step 1: Install the extension</p>
            </div>
            <div className="flex items-center space-x-4">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
              <p>Step 2: Choose wallet</p>
            </div>
            <div className="flex items-center space-x-4">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
              <p>Step 3: Open a tweet with TokenScript Viewer link</p>
            </div>
          </CardContent>
        </Card>

        {/* <div className="flex justify-center">
          <Button size="lg">
            Get Started
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div> */}
      </main>
    </div>
  )
}
