import { Book, Brain, MessageSquare, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/supabase'

export function Navigation() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        return
      }
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Unexpected error during logout:', error)
    }
  }

  return (
    <div className="w-16 bg-black p-4 flex flex-col items-center space-y-8">
      <div className="absolute bottom-4 w-16 flex justify-center">
        <button
          onClick={handleLogout}
          className="p-3 text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  )
}