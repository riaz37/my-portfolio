'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/ui/data-display/card';
import { Button } from '@/components/shared/ui/core/button';
import { Expand, Minimize, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamePreviewProps {
  gameUrl: string;
  title: string;
  className?: string;
  onError?: () => void;
}

export default function GamePreview({ gameUrl, title, className, onError }: GamePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when gameUrl changes
    setIsLoading(true);
    setHasError(false);
  }, [gameUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe refresh by temporarily removing it
    const iframe = document.getElementById('game-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card 
      id="game-container"
      className={cn(
        'relative overflow-hidden bg-background',
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video',
        className
      )}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
          <p className="text-destructive mb-4">Failed to load game</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Expand className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Game Title */}
      <div className="absolute top-2 left-2 z-10">
        <h3 className="text-sm font-medium px-2 py-1 rounded bg-background/50 backdrop-blur-sm">
          {title}
        </h3>
      </div>

      {/* Game Frame */}
      <iframe
        id="game-frame"
        src={gameUrl}
        title={title}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        allow="fullscreen; autoplay; accelerometer; gyroscope; magnetometer; microphone; camera"
        loading="lazy"
      />
    </Card>
  );
}
