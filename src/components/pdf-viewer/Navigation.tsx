import { Book, Brain, MessageSquare, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()

  const handleLogout = async () => {
    // Clear authentication tokens or session data here
    // For example: localStorage.removeItem('authToken')
    router.push('/login')
  }

  return (
    <div className="w-16 bg-black p-4 flex flex-col items-center space-y-8">
      <Button variant="ghost" size="icon" className="text-slate-200">
        <Book className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" className="text-slate-200">
        <Brain className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" className="text-slate-200">
        <MessageSquare className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" className="text-slate-200">
        <Settings className="h-6 w-6" />
      </Button>
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