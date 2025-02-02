import { StarBorder } from '../components/ui/star-border'
import { Squares } from '../components/ui/squares-background'
import Link from 'next/link'
import { RainbowButton } from '../components/ui/rainbow-button'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 text-white">Premium PDF Reader</h1>
            <p className="text-xl mb-12 text-gray-300">
              An AI-powered PDF reading experience that helps you understand and analyze documents better.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <RainbowButton>Sign In</RainbowButton>
              </Link>
              <Link href="/auth/signup">
                <RainbowButton>Sign Up</RainbowButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
