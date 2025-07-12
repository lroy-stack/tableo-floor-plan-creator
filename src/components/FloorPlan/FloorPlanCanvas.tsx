import React, { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Table, CanvasElement } from './types';
import { ElementRenderer } from './ElementRenderer';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasStatusBar } from './CanvasStatusBar';

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
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedCount, setSelectedCount] = useState(0);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridOpacity = zoom > 0.5 ? 0.3 : 0.1;
    ctx.strokeStyle = `hsla(214, 20%, 85%, ${gridOpacity})`;
    ctx.lineWidth = 0.5 / zoom;
    
    const gridSpacing = GRID_SIZE * (zoom < 0.5 ? 2 : 1);
    
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  }, [zoom]);

  const drawTable = useCallback((ctx: CanvasRenderingContext2D, table: Table) => {
    const { x, y, shape, capacity, name, id } = table;
    const isSelected = selectedTable?.id === id;
    const size = Math.max(40, capacity.max * 8);
    
    ctx.save();
    
    // Enhanced shadow system
    if (isSelected) {
      ctx.shadowColor = 'hsla(142, 76%, 36%, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    } else {
      ctx.shadowColor = 'hsla(217, 91%, 50%, 0.12)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
    }
    
    // Gradient background
    const gradient = ctx.createRadialGradient(x, y - size * 0.2, 0, x, y, size / 2);
    if (isSelected) {
      gradient.addColorStop(0, 'hsl(142, 76%, 36%)');
      gradient.addColorStop(1, 'hsl(142, 76%, 30%)');
    } else {
      gradient.addColorStop(0, 'hsl(217, 91%, 50%)');
      gradient.addColorStop(1, 'hsl(217, 91%, 45%)');
    }
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = isSelected ? 'hsl(142, 76%, 36%)' : 'hsl(217, 91%, 50%)';
    ctx.lineWidth = isSelected ? 3 : 2;
    
    if (shape === 'circular') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Inner highlight
      ctx.beginPath();
      ctx.arc(x, y - size * 0.15, size / 4, 0, Math.PI, true);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      const rectSize = size * 0.8;
      const radius = 4;
      
      // Rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize, radius);
      ctx.fill();
      ctx.stroke();
      
      // Inner highlight
      ctx.beginPath();
      ctx.roundRect(x - rectSize / 2 + 3, y - rectSize / 2 + 3, rectSize - 6, rectSize / 3, 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Enhanced text with better contrast
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y - 2);
    
    // Capacity with background
    ctx.font = '10px system-ui, sans-serif';
    const capacityText = `${capacity.min}-${capacity.max}`;
    const textWidth = ctx.measureText(capacityText).width;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x - textWidth / 2 - 4, y + 8, textWidth + 8, 14);
    
    ctx.fillStyle = 'white';
    ctx.fillText(capacityText, x, y + 15);
    
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
    
    // Enhanced background with subtle texture
    const bgGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, 'hsl(212 25% 98%)');
    bgGradient.addColorStop(1, 'hsl(210 20% 95%)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Subtle texture overlay
    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * CANVAS_WIDTH;
      const y = Math.random() * CANVAS_HEIGHT;
      ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
    
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
    
    console.log('Mouse down at:', pos, 'Found table:', table);
    
    if (table) {
      setDraggedTable(table);
      setDragStart({ x: pos.x - table.x, y: pos.y - table.y });
      onTableSelect(table);
      setIsDragging(true);
    } else {
      onTableSelect(null);
      setIsDragging(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable) return;
    
    const pos = getMousePos(e);
    const newX = snapToGrid(pos.x - dragStart.x);
    const newY = snapToGrid(pos.y - dragStart.y);
    
    console.log('Moving table to:', newX, newY);
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
    toast.success('Mapa guardado exitosamente', {
      description: `${tables.length} mesas guardadas`,
    });
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    // Here you could implement different tool behaviors
  };

  // Calculate total capacity
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity.max, 0);

  // Update selected count when selectedTable changes
  useEffect(() => {
    setSelectedCount(selectedTable ? 1 : 0);
  }, [selectedTable]);

  return (
    <div className={`canvas-container relative ${className}`}>
      {/* Enhanced Toolbar */}
      <CanvasToolbar
        zoom={zoom}
        activeToolsCount={tables.length}
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onReset={handleReset}
        onSave={handleSave}
        activeTool={activeTool}
        onToolChange={handleToolChange}
      />

      {/* Professional Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block cursor-crosshair transition-all duration-300 touch-none"
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '70vh',
          filter: zoom < 0.3 ? 'contrast(1.1)' : 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Enhanced Status Bar */}
      <CanvasStatusBar
        zoom={zoom}
        tableCount={tables.length}
        totalCapacity={totalCapacity}
        selectedCount={selectedCount}
        showGrid={true}
      />

      {/* Ambient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.02] rounded-lg" />
      </div>
    </div>
  );
};