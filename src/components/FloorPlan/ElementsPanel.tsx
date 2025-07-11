import React, { useState } from 'react';
import { 
  Circle, Square, Minus, DoorOpen, TreePine, Plus, 
  Wine, Columns, MoveUp, Image, Home, Flame,
  ChevronDown, RectangleHorizontal, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableConfiguration, CanvasElement, ElementType } from './types';

interface ElementsPanelProps {
  onAddTable: (config: TableConfiguration, x: number, y: number) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
  excludedTables: Table[];
  onRestoreTable: (table: Table) => void;
  className?: string;
}

const ELEMENT_TEMPLATES = [
  // Structural Elements
  {
    category: 'structural',
    title: 'Elementos Estructurales',
    elements: [
      { type: 'wall', icon: Minus, label: 'Pared', color: 'text-slate-600' },
      { type: 'door', icon: DoorOpen, label: 'Puerta', color: 'text-amber-600' },
      { type: 'window', icon: Square, label: 'Ventana', color: 'text-blue-500' },
      { type: 'column', icon: Columns, label: 'Columna', color: 'text-gray-600' },
      { type: 'stairs', icon: MoveUp, label: 'Escaleras', color: 'text-purple-600' }
    ]
  },
  // Furniture Elements
  {
    category: 'furniture',
    title: 'Mobiliario',
    elements: [
      { type: 'bar', icon: Wine, label: 'Barra', color: 'text-amber-700' }
    ]
  },
  // Decorative Elements
  {
    category: 'decorative',
    title: 'Elementos Decorativos',
    elements: [
      { type: 'plant', icon: TreePine, label: 'Planta', color: 'text-green-600' },
      { type: 'artwork', icon: Image, label: 'Arte/Cuadro', color: 'text-indigo-600' },
      { type: 'carpet', icon: RectangleHorizontal, label: 'Alfombra', color: 'text-red-500' },
      { type: 'fireplace', icon: Flame, label: 'Chimenea', color: 'text-orange-600' }
    ]
  }
];

export const ElementsPanel: React.FC<ElementsPanelProps> = ({
  onAddTable,
  onAddElement,
  excludedTables,
  onRestoreTable,
  className = ''
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['tables', 'structural']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleAddTable = (shape: 'circular' | 'rectangular') => {
    const config: TableConfiguration = {
      shape,
      minCapacity: 2,
      maxCapacity: 4,
      name: `Mesa ${Date.now().toString().slice(-4)}`
    };
    
    // Add table to center of canvas
    onAddTable(config, 600, 400);
  };

  const handleAddElement = (type: ElementType) => {
    const baseElement: Partial<CanvasElement> = {
      id: `${type}-${Date.now()}`,
      type,
      x: 600,
      y: 400,
      rotation: 0,
      layer: 1
    };

    // Set default dimensions based on element type
    switch (type) {
      case 'wall':
        onAddElement({
          ...baseElement,
          width: 100,
          height: 8,
          properties: { thickness: 8, material: 'concrete' }
        });
        break;
      case 'door':
        onAddElement({
          ...baseElement,
          width: 80,
          height: 20,
          properties: { doorType: 'single', openDirection: 'right' }
        });
        break;
      case 'window':
        onAddElement({
          ...baseElement,
          width: 100,
          height: 60,
          properties: { windowType: 'standard', hasFrame: true }
        });
        break;
      case 'plant':
        onAddElement({
          ...baseElement,
          width: 40,
          height: 40,
          properties: { plantType: 'potted', size: 'medium', potStyle: 'ceramic' }
        });
        break;
      case 'bar':
        onAddElement({
          ...baseElement,
          width: 200,
          height: 60,
          properties: { barType: 'straight', material: 'wood', hasSeating: true, seatCount: 4 }
        });
        break;
      case 'column':
        onAddElement({
          ...baseElement,
          width: 40,
          height: 40,
          properties: { columnType: 'round', diameter: 40, material: 'concrete' }
        });
        break;
      case 'stairs':
        onAddElement({
          ...baseElement,
          width: 100,
          height: 80,
          properties: { direction: 'up', stepCount: 8, hasRailing: true }
        });
        break;
      case 'artwork':
        onAddElement({
          ...baseElement,
          width: 80,
          height: 60,
          properties: { artType: 'painting', frameStyle: 'modern' }
        });
        break;
      case 'carpet':
        onAddElement({
          ...baseElement,
          width: 120,
          height: 80,
          properties: { pattern: 'solid', color: 'hsl(var(--accent))' }
        });
        break;
      case 'fireplace':
        onAddElement({
          ...baseElement,
          width: 120,
          height: 100,
          properties: { fireplaceType: 'traditional', isLit: false }
        });
        break;
      default:
        onAddElement(baseElement);
    }
  };

  return (
    <Card className={`w-80 shadow-panel ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Elementos del Mapa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Table Types */}
        <Collapsible 
          open={openSections.includes('tables')} 
          onOpenChange={() => toggleSection('tables')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h3 className="text-sm font-medium text-foreground">Tipos de Mesa</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                openSections.includes('tables') ? 'rotate-180' : ''
              }`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => handleAddTable('circular')}
              >
                <Circle className="h-8 w-8 text-primary" />
                <span className="text-xs">Mesa Circular</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => handleAddTable('rectangular')}
              >
                <Square className="h-8 w-8 text-primary" />
                <span className="text-xs">Mesa Rectangular</span>
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Element Categories */}
        {ELEMENT_TEMPLATES.map(category => (
          <div key={category.category}>
            <Collapsible 
              open={openSections.includes(category.category)} 
              onOpenChange={() => toggleSection(category.category)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h3 className="text-sm font-medium text-foreground">{category.title}</h3>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    openSections.includes(category.category) ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="space-y-2">
                  {category.elements.map(element => {
                    const IconComponent = element.icon;
                    return (
                      <Button
                        key={element.type}
                        variant="outline"
                        className="w-full justify-start gap-3 hover:bg-muted"
                        onClick={() => handleAddElement(element.type as ElementType)}
                      >
                        <IconComponent className={`h-4 w-4 ${element.color}`} />
                        <span className="text-sm">{element.label}</span>
                        <Plus className="ml-auto h-3 w-3 text-muted-foreground" />
                      </Button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
          </div>
        ))}

        {/* Floor Settings */}
        <Collapsible 
          open={openSections.includes('floor')} 
          onOpenChange={() => toggleSection('floor')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h3 className="text-sm font-medium text-foreground">Configuración del Suelo</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                openSections.includes('floor') ? 'rotate-180' : ''
              }`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-muted"
                disabled
              >
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Textura del Suelo</span>
                <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Excluded Tables */}
        {excludedTables.length > 0 && (
          <>
            <Separator />
            <Collapsible 
              open={openSections.includes('excluded')} 
              onOpenChange={() => toggleSection('excluded')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h3 className="text-sm font-medium text-foreground">
                    Mesas Excluidas ({excludedTables.length})
                  </h3>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    openSections.includes('excluded') ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {excludedTables.map(table => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {table.shape === 'circular' ? (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">{table.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({table.capacity.min}-{table.capacity.max})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onRestoreTable(table)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </CardContent>
    </Card>
  );
};