import { StarBorder } from '../components/ui/star-border'
import { Squares } from '../components/ui/squares-background'
import Link from 'next/link'
import { RainbowButton } from '../components/ui/rainbow-button'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      <Squares className="absolute inset-0 opacity-100 hoverFillColor: white squareSize:100" />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-7xl font-normal mb-6 text-white font-serif tracking-tight">
            Scrolly
            </h1>
            <p className="text-2xl mb-12 text-gray-300 font-serif leading-relaxed">
            Reading on your device should be much simpler and better            </p>
            <div className="flex gap-6 justify-center">
              <Link href="/auth/login">
                <StarBorder className="transition-transform hover:scale-105">
                  <span className="text-lg">Sign In</span>
                </StarBorder>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
