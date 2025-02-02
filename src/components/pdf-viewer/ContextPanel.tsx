import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Discussion } from '../ai/Discussion'
import { Explanations } from '../ai/Explanations'

interface ContextPanelProps {
  selectedText: string
}

export function ContextPanel({ selectedText }: ContextPanelProps) {
  return (
    <div className="w-96 bg-slate-50 border-l flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Discussion selectedText={selectedText} />
      </div>
    </div>
  )
}