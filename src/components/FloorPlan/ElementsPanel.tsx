import React from 'react';
import { Circle, Square, Minus, DoorOpen, TreePine, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableConfiguration } from './types';

interface ElementsPanelProps {
  onAddTable: (config: TableConfiguration, x: number, y: number) => void;
  excludedTables: Table[];
  onRestoreTable: (table: Table) => void;
  className?: string;
}

export const ElementsPanel: React.FC<ElementsPanelProps> = ({
  onAddTable,
  excludedTables,
  onRestoreTable,
  className = ''
}) => {
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

  return (
    <Card className={`w-80 shadow-panel ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Elementos del Mapa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Table Types */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Tipos de Mesa</h3>
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
        </div>

        <Separator />

        {/* Structural Elements */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Elementos Estructurales</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-muted"
              disabled
            >
              <Minus className="h-4 w-4 text-wall" />
              <span className="text-sm">Pared</span>
              <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-muted"
              disabled
            >
              <DoorOpen className="h-4 w-4 text-door" />
              <span className="text-sm">Puerta</span>
              <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Decorative Elements */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Elementos Decorativos</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-muted"
              disabled
            >
              <TreePine className="h-4 w-4 text-accent" />
              <span className="text-sm">Planta</span>
              <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
            </Button>
          </div>
        </div>

        {/* Excluded Tables */}
        {excludedTables.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Mesas Excluidas ({excludedTables.length})
              </h3>
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};