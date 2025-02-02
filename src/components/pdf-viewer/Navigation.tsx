import { Book, Brain, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

export function Navigation() {
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
    </div>
  )
}