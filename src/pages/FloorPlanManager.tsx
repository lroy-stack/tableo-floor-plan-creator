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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Editor de Mapa de Mesas
              </h1>
              <p className="text-muted-foreground">
                Gestiona la distribución de mesas de tu restaurante
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mesas activas: {activeTables.length}</span>
              <span>•</span>
              <span>Última modificación: Ahora</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6 h-full">
          {/* Left Panel - Elements */}
          <ElementsPanel
            onAddTable={handleAddTable}
            excludedTables={excludedTables}
            onRestoreTable={handleRestoreTable}
            className="flex-shrink-0"
          />

          {/* Center - Canvas */}
          <div className="flex-1">
            <FloorPlanCanvas
              tables={activeTables}
              elements={elements}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              onTableMove={handleTableMove}
              onSave={handleSave}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Configuration Modal */}
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