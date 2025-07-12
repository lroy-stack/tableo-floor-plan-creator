import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Grid3X3, Clock, Target } from 'lucide-react';

interface CanvasStatusBarProps {
  zoom: number;
  tableCount: number;
  totalCapacity: number;
  selectedCount: number;
  lastModified?: string;
  showGrid?: boolean;
}

export const CanvasStatusBar: React.FC<CanvasStatusBarProps> = ({
  zoom,
  tableCount,
  totalCapacity,
  selectedCount,
  lastModified = 'Ahora',
  showGrid = true
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-20 glass-panel rounded-xl p-3 flex items-center gap-3 text-sm backdrop-blur-md">
      {/* Zoom Level */}
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-xs font-medium">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Table Stats */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-white/50 border-primary/20">
          <Users className="h-3 w-3 mr-1" />
          {tableCount} mesas
        </Badge>
        <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent-foreground">
          Capacidad: {totalCapacity}
        </Badge>
      </div>

      {selectedCount > 0 && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="default" className="bg-primary/90">
            {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
          </Badge>
        </>
      )}

      <Separator orientation="vertical" className="h-4" />

      {/* Grid Status */}
      {showGrid && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Grid3X3 className="h-3 w-3" />
          <span className="text-xs">Grid</span>
        </div>
      )}

      {/* Last Modified */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span className="text-xs">{lastModified}</span>
      </div>
    </div>
  );
};