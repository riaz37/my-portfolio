import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/shared/ui/core/button'
import { Badge } from '@/components/shared/ui/core/badge'

import { ArrowLeft, Clock, Video, FileText, Code, CheckCircle2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/shared/ui/feedback/progress'

interface ResourceViewerProps {
  resource: Resource
  onBack: () => void
  onComplete?: (resourceId: string) => void
}

export function ResourceViewer({ resource, onBack, onComplete }: ResourceViewerProps) {
  const [isCompleted, setIsCompleted] = useState(resource.completed)

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete?.(resource.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-25" />
        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="group mb-2 -ml-2 hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {resource.type === 'video' && <Video className="w-6 h-6 text-primary" />}
                  {resource.type === 'article' && <FileText className="w-6 h-6 text-primary" />}
                  {resource.type === 'practice' && <Code className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{resource.title}</h1>
                  <p className="text-muted-foreground mt-1">{resource.description}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <Badge variant="outline" className="px-4 py-2 gap-2 text-sm">
                <Clock className="w-4 h-4" />
                {resource.duration}
              </Badge>
              {isCompleted && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-25" />
        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
          <div className="aspect-video w-full bg-background/50 rounded-lg mb-8">
            {/* Resource content iframe/embed would go here */}
            <div className="w-full h-full flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                className="gap-2"
                onClick={() => window.open(resource.url, '_blank')}
              >
                Open Resource
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your Progress</p>
              <div className="w-48">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{isCompleted ? '100%' : '0%'}</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                  <Progress value={isCompleted ? 100 : 0} className="h-2" />
                </div>
              </div>
            </div>

            <Button
              variant={isCompleted ? "secondary" : "default"}
              size="lg"
              onClick={handleComplete}
              disabled={isCompleted}
              className={cn(
                "min-w-[200px] gap-2",
                isCompleted && "bg-primary/20 text-primary hover:bg-primary/30"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
