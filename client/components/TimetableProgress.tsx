import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { TimeTableBlock } from '@shared/api';

interface TimetableProgressProps {
  blocks: TimeTableBlock[];
  onComplete?: (completedBlocks: string[]) => void;
}

interface BlockProgress {
  id: string;
  status: 'pending' | 'in-progress' | 'completed';
  timeSpent: number; // in minutes
  startTime?: Date;
}

export const TimetableProgress: React.FC<TimetableProgressProps> = ({ 
  blocks, 
  onComplete 
}) => {
  const [progress, setProgress] = useState<Record<string, BlockProgress>>({});
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize progress for all blocks
  useEffect(() => {
    const initialProgress: Record<string, BlockProgress> = {};
    blocks.forEach((block, index) => {
      const blockId = `${block.subject}-${index}`;
      initialProgress[blockId] = {
        id: blockId,
        status: 'pending',
        timeSpent: 0
      };
    });
    setProgress(initialProgress);
  }, [blocks]);

  // Timer effect for active block
  useEffect(() => {
    if (activeBlock && progress[activeBlock]?.status === 'in-progress') {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          [activeBlock]: {
            ...prev[activeBlock],
            timeSpent: prev[activeBlock].timeSpent + 1
          }
        }));
      }, 60000); // Update every minute

      setTimer(interval);
      return () => clearInterval(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [activeBlock, progress]);

  const startBlock = (blockId: string) => {
    setProgress(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        status: 'in-progress',
        startTime: new Date()
      }
    }));
    setActiveBlock(blockId);
  };

  const pauseBlock = (blockId: string) => {
    setProgress(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        status: 'pending'
      }
    }));
    setActiveBlock(null);
  };

  const completeBlock = (blockId: string) => {
    setProgress(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        status: 'completed'
      }
    }));
    setActiveBlock(null);

    // Check if all blocks are completed
    const updatedProgress = { ...progress };
    updatedProgress[blockId] = { ...updatedProgress[blockId], status: 'completed' };
    
    const completedBlocks = Object.values(updatedProgress)
      .filter(p => p.status === 'completed')
      .map(p => p.id);
    
    if (onComplete) {
      onComplete(completedBlocks);
    }
  };

  const resetBlock = (blockId: string) => {
    setProgress(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        status: 'pending',
        timeSpent: 0,
        startTime: undefined
      }
    }));
    if (activeBlock === blockId) {
      setActiveBlock(null);
    }
  };

  const getProgressPercentage = () => {
    const completed = Object.values(progress).filter(p => p.status === 'completed').length;
    return (completed / blocks.length) * 100;
  };

  const getTotalTimeSpent = () => {
    return Object.values(progress).reduce((total, p) => total + p.timeSpent, 0);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getExpectedDuration = (block: TimeTableBlock) => {
    const match = block.duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📊 Study Session Progress
            <Badge variant="outline">
              {Object.values(progress).filter(p => p.status === 'completed').length} / {blocks.length} completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getProgressPercentage()} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {Math.round(getProgressPercentage())}%</span>
              <span>Time Spent: {formatTime(getTotalTimeSpent())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Progress */}
      <div className="grid gap-4">
        {blocks.map((block, index) => {
          const blockId = `${block.subject}-${index}`;
          const blockProgress = progress[blockId];
          const expectedDuration = getExpectedDuration(block);
          const isActive = activeBlock === blockId;
          
          if (!blockProgress) return null;

          return (
            <Card key={blockId} className={`transition-all ${
              blockProgress.status === 'completed' ? 'bg-green-50 border-green-200' :
              blockProgress.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{block.subject}</h3>
                      <Badge variant={block.activity.includes('Practice') ? 'default' : 'secondary'}>
                        {block.activity.includes('Practice') ? 'Practice' : 'Study'}
                      </Badge>
                      {blockProgress.status === 'completed' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{block.activity}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expected: {block.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Spent: {formatTime(blockProgress.timeSpent)}
                      </span>
                    </div>

                    {blockProgress.status === 'in-progress' && (
                      <div className="mt-2">
                        <Progress 
                          value={(blockProgress.timeSpent / expectedDuration) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {blockProgress.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => startBlock(blockId)}
                        className="flex items-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    )}
                    
                    {blockProgress.status === 'in-progress' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pauseBlock(blockId)}
                          className="flex items-center gap-1"
                        >
                          <Pause className="h-3 w-3" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => completeBlock(blockId)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Complete
                        </Button>
                      </>
                    )}
                    
                    {blockProgress.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetBlock(blockId)}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TimetableProgress;
