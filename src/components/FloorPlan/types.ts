export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  shape: 'circular' | 'rectangular';
  capacity: {
    min: number;
    max: number;
  };
  diningArea: string;
  status: 'active' | 'excluded';
}

export interface CanvasElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'plant' | 'bar';
  coordinates: { x: number; y: number }[];
  properties?: Record<string, any>;
}

export interface DiningArea {
  id: string;
  name: string;
  serviceHours: string[];
}

export interface FloorMap {
  id: string;
  name: string;
  type: 'unified' | 'separated';
  diningAreas: DiningArea[];
  tables: Table[];
  elements: CanvasElement[];
  created: Date;
  updated: Date;
}

export interface ServiceHour {
  id: string;
  name: string;
  description: string;
}

export interface TableConfiguration {
  shape: 'circular' | 'rectangular';
  minCapacity: number;
  maxCapacity: number;
  name: string;
}