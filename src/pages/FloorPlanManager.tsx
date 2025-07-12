import React, { useState, useCallback } from 'react';
import { FloorPlanCanvas } from '@/components/FloorPlan/FloorPlanCanvas';
import { ElementsPanel } from '@/components/FloorPlan/ElementsPanel';
import { TableConfigModal } from '@/components/FloorPlan/TableConfigModal';
import { Table, CanvasElement, TableConfiguration } from '@/components/FloorPlan/types';
import { toast } from 'sonner';

// Sample initial data
const initialTables: Table[] = [
  {
    id: 'table-1',
    name: 'Mesa 1',
    x: 200,
    y: 150,
    shape: 'circular',
    capacity: { min: 2, max: 4 },
    diningArea: 'interior',
    status: 'active'
  },
  {
    id: 'table-2',
    name: 'Mesa 2',
    x: 400,
    y: 150,
    shape: 'rectangular',
    capacity: { min: 4, max: 6 },
    diningArea: 'interior',
    status: 'active'
  },
  {
    id: 'table-3',
    name: 'Mesa 3',
    x: 600,
    y: 200,
    shape: 'circular',
    capacity: { min: 2, max: 6 },
    diningArea: 'exterior',
    status: 'active'
  },
  {
    id: 'table-excluded',
    name: 'Mesa Temporal',
    x: 100,
    y: 100,
    shape: 'rectangular',
    capacity: { min: 2, max: 4 },
    diningArea: 'interior',
    status: 'excluded'
  }
];

const FloorPlanManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const activeTables = tables.filter(table => table.status === 'active');
  const excludedTables = tables.filter(table => table.status === 'excluded');

  const handleTableSelect = useCallback((table: Table | null) => {
    setSelectedTable(table);
    if (table) {
      setIsConfigModalOpen(true);
    }
  }, []);

  const handleTableMove = useCallback((tableId: string, x: number, y: number) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, x, y }
        : table
    ));
  }, []);

  const handleAddTable = useCallback((config: TableConfiguration, x: number, y: number) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: config.name,
      x,
      y,
      shape: config.shape,
      capacity: {
        min: config.minCapacity,
        max: config.maxCapacity
      },
      diningArea: 'interior',
      status: 'active'
    };

    setTables(prev => [...prev, newTable]);
    toast.success(`Mesa "${config.name}" agregada exitosamente`);
  }, []);

  const handleTableSave = useCallback((updatedTable: Table) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ));
    toast.success(`Mesa "${updatedTable.name}" actualizada`);
  }, []);

  const handleTableDelete = useCallback((tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    setTables(prev => prev.filter(t => t.id !== tableId));
    toast.success(`Mesa "${table?.name}" eliminada`);
  }, [tables]);

  const handleAddElement = useCallback((element: Partial<CanvasElement>) => {
    const newElement: CanvasElement = {
      id: element.id || `element-${Date.now()}`,
      type: element.type!,
      x: element.x || 600,
      y: element.y || 400,
      width: element.width,
      height: element.height,
      rotation: element.rotation || 0,
      properties: element.properties || {},
      layer: element.layer || 1
    };
    
    setElements(prev => [...prev, newElement]);
    toast.success(`Elemento "${element.type}" agregado`);
  }, []);

  const handleRestoreTable = useCallback((table: Table) => {
    const restoredTable: Table = {
      ...table,
      status: 'active',
      x: 300, // Reset position
      y: 300
    };
    
    setTables(prev => prev.map(t => 
      t.id === table.id ? restoredTable : t
    ));
    toast.success(`Mesa "${table.name}" restaurada al mapa`);
  }, []);

  const handleSave = useCallback(() => {
    // Here you would typically save to a backend
    const floorMapData = {
      tables: activeTables,
      elements,
      timestamp: new Date().toISOString()
    };
    
    console.log('Saving floor plan:', floorMapData);
    // For now, just show success message
  }, [activeTables, elements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Professional Header */}
      <div className="glass-panel border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Editor de Mapa de Mesas
              </h1>
              <p className="text-muted-foreground text-lg">
                Diseña y gestiona la distribución perfecta de tu restaurante
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-accent">
                    Sistema activo
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Capacidad total: {activeTables.reduce((sum, table) => sum + table.capacity.max, 0)} personas
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {activeTables.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mesas activas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {excludedTables.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Temporales
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center border-t border-border/30 pt-2">
                Última modificación: Ahora
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8 h-full min-h-[70vh]">
          {/* Enhanced Left Panel */}
          <div className="flex-shrink-0">
            <ElementsPanel
              onAddTable={handleAddTable}
              onAddElement={handleAddElement}
              excludedTables={excludedTables}
              onRestoreTable={handleRestoreTable}
              className="glass-panel rounded-xl shadow-strong"
            />
          </div>

          {/* Premium Canvas Area */}
          <div className="flex-1 space-y-4">
            <FloorPlanCanvas
              tables={activeTables}
              elements={elements}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              onTableMove={handleTableMove}
              onSave={handleSave}
              className="w-full shadow-strong"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Configuration Modal */}
      <TableConfigModal
        table={selectedTable}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedTable(null);
        }}
        onSave={handleTableSave}
        onDelete={handleTableDelete}
      />
    </div>
  );
};

export default FloorPlanManager;