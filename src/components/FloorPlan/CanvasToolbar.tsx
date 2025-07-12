import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Save, Grid3X3, Move, MousePointer2, Hand, Square, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CanvasToolbarProps {
  zoom: number;
  activeToolsCount: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSave: () => void;
  activeTool?: string;
  onToolChange?: (tool: string) => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  zoom,
  activeToolsCount,
  onZoomIn,
  onZoomOut,
  onReset,
  onSave,
  activeTool = 'select',
  onToolChange
}) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Seleccionar' },
    { id: 'pan', icon: Hand, label: 'Mover vista' },
    { id: 'table-round', icon: Circle, label: 'Mesa redonda' },
    { id: 'table-square', icon: Square, label: 'Mesa cuadrada' },
  ];

  return (
    <TooltipProvider>
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {/* Tools Section */}
        <div className="glass-panel rounded-xl p-1 flex items-center gap-1">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onToolChange?.(tool.id)}
                  className={`h-8 w-8 p-0 interactive ${
                    activeTool === tool.id 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-hover-overlay'
                  }`}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Zoom Controls */}
        <div className="glass-panel rounded-xl p-1 flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0 interactive hover:bg-hover-overlay"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Alejar</p>
            </TooltipContent>
          </Tooltip>

          <div className="px-2 py-1 min-w-[3rem] text-xs font-medium text-center text-muted-foreground">
            {Math.round(zoom * 100)}%
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0 interactive hover:bg-hover-overlay"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Acercar</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 w-8 p-0 interactive hover:bg-hover-overlay"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Restablecer vista</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Save Section */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              className="glass-panel bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium px-4 h-8 interactive shadow-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
              {activeToolsCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-white/20">
                  {activeToolsCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Guardar cambios del mapa</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};