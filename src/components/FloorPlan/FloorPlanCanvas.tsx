import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, CanvasElement } from './types';
import { ElementRenderer } from './ElementRenderer';

interface FloorPlanCanvasProps {
  tables: Table[];
  elements: CanvasElement[];
  selectedTable?: Table | null;
  onTableSelect: (table: Table | null) => void;
  onTableMove: (tableId: string, x: number, y: number) => void;
  onSave: () => void;
  className?: string;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  tables,
  elements,
  selectedTable,
  onTableSelect,
  onTableMove,
  onSave,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedTable, setDraggedTable] = useState<Table | null>(null);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'hsl(var(--canvas-grid))';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  }, []);

  const drawTable = useCallback((ctx: CanvasRenderingContext2D, table: Table) => {
    const { x, y, shape, capacity, name, id } = table;
    const isSelected = selectedTable?.id === id;
    const size = Math.max(40, capacity.max * 8);
    
    ctx.save();
    
    // Shadow
    if (!isSelected) {
      ctx.shadowColor = 'hsla(217, 91%, 50%, 0.15)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
    }
    
    // Table body
    ctx.fillStyle = isSelected ? 'hsl(var(--table-selected))' : 'hsl(var(--table-active))';
    ctx.strokeStyle = isSelected ? 'hsl(var(--accent))' : 'hsl(var(--primary))';
    ctx.lineWidth = isSelected ? 3 : 2;
    
    if (shape === 'circular') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      const rectSize = size * 0.8;
      ctx.fillRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);
      ctx.strokeRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);
    }
    
    // Table name
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);
    
    // Capacity indicator
    ctx.font = '10px sans-serif';
    ctx.fillText(`${capacity.min}-${capacity.max}`, x, y + 15);
    
    ctx.restore();
  }, [selectedTable]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);
    
    // Background
    ctx.fillStyle = 'hsl(var(--canvas-bg))';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Grid
    drawGrid(ctx);
    
    // Draw elements (walls, doors, etc.)
    const renderer = new ElementRenderer(ctx);
    elements.forEach(element => {
      renderer.renderElement(element);
    });
    
    // Draw tables
    tables.forEach(table => {
      drawTable(ctx, table);
    });
    
    ctx.restore();
  }, [zoom, pan, tables, elements, drawGrid, drawTable]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x * zoom) / zoom,
      y: (e.clientY - rect.top - pan.y * zoom) / zoom
    };
  };

  const getTableAt = (x: number, y: number): Table | null => {
    return tables.find(table => {
      const size = Math.max(40, table.capacity.max * 8);
      const distance = Math.sqrt((x - table.x) ** 2 + (y - table.y) ** 2);
      return distance <= size / 2;
    }) || null;
  };

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const table = getTableAt(pos.x, pos.y);
    
    if (table) {
      setDraggedTable(table);
      setDragStart({ x: pos.x - table.x, y: pos.y - table.y });
      onTableSelect(table);
    } else {
      onTableSelect(null);
    }
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable) return;
    
    const pos = getMousePos(e);
    const newX = snapToGrid(pos.x - dragStart.x);
    const newY = snapToGrid(pos.y - dragStart.y);
    
    onTableMove(draggedTable.id, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedTable(null);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSave = () => {
    onSave();
    toast.success('Mapa guardado exitosamente');
  };

  return (
    <div className={`relative bg-canvas-bg border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-panel">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(0.1)}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(-0.1)}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="w-px bg-border" />
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-1" />
          Guardar
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block cursor-crosshair"
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '70vh'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Info panel */}
      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 text-sm text-muted-foreground">
        Zoom: {Math.round(zoom * 100)}% | Mesas: {tables.length}
      </div>
    </div>
  );
};