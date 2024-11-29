import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/core/tabs';
import { Button } from '@/components/shared/ui/core/button';

interface SolutionViewerProps {
  javascript: string;
  python: string;
}

export function SolutionViewer({ javascript, python }: SolutionViewerProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Solution</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Solution
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Solution
            </>
          )}
        </Button>
      </div>

      {showSolution && (
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="javascript">
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
              <code>{javascript}</code>
            </pre>
          </TabsContent>
          <TabsContent value="python">
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
              <code>{python}</code>
            </pre>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
