'use client';

import { motion } from 'framer-motion';
import { FeatureGate } from '@/components/features/playground/FeatureGate';
import { Button } from '@/components/shared/ui/core/button';
import { Code2, Save, Share, Sparkles, Clock, Terminal, Braces, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Terminal,
    title: 'Multi-Language Support',
    description: 'Code in Python, JavaScript, Java, and more'
  },
  {
    icon: Braces,
    title: 'Syntax Highlighting',
    description: 'Beautiful code highlighting and formatting'
  },
  {
    icon: PlayCircle,
    title: 'Live Execution',
    description: 'Run your code in real-time with instant feedback'
  }
];

export default function PracticeArena() {
  return (
    <div className="min-h-screen relative bg-dot-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative">
        {/* Header Section */}
        <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-8">
              <Clock className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Practice Arena
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
              A powerful live code editor designed to help you practice and improve your coding skills.
              Write, run, and share code in multiple programming languages.
            </p>
          </motion.div>

          {/* Code Editor Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg shadow-black/5">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-2 border-b border-border/50 bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 px-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-xs text-muted-foreground">main.py</div>
                </div>
                <div className="flex gap-2 px-4">
                  {['Python', 'JavaScript', 'Java', 'C++'].map((lang) => (
                    <div
                      key={lang}
                      className="px-2 py-1 text-xs rounded bg-primary/10 text-primary"
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Content */}
              <div className="relative min-h-[400px] bg-background/50 p-4">
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="text-center p-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We're working hard to bring you a powerful code editor. Stay tuned for updates!
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" className="gap-2">
                        <Code2 className="w-4 h-4" />
                        Run Code
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Share className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
                <pre className="opacity-20">
                  <code className="text-sm">
                    {`def hello_world():
    print("Hello, World!")
    
# Function to calculate fibonacci series
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence

# Main function
if __name__ == "__main__":
    hello_world()
    print(fibonacci(10))`}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  "p-6 rounded-xl border border-border/50",
                  "bg-card/50 backdrop-blur-sm",
                  "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300"
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}