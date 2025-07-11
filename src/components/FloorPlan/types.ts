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
  rotation?: number;
  material?: 'wood' | 'glass' | 'metal';
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  properties?: Record<string, any>;
  layer?: number;
}

export type ElementType = 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'plant' 
  | 'bar' 
  | 'column' 
  | 'stairs'
  | 'artwork'
  | 'carpet'
  | 'fireplace';

export interface WallElement extends CanvasElement {
  type: 'wall';
  endX: number;
  endY: number;
  thickness?: number;
  material?: 'brick' | 'wood' | 'glass' | 'concrete';
  color?: string;
}

export interface DoorElement extends CanvasElement {
  type: 'door';
  doorType?: 'single' | 'double' | 'glass' | 'sliding';
  openDirection?: 'left' | 'right' | 'push' | 'pull';
  width: number;
}

export interface WindowElement extends CanvasElement {
  type: 'window';
  windowType?: 'standard' | 'bay' | 'floor-to-ceiling';
  width: number;
  height: number;
  hasFrame?: boolean;
}

export interface PlantElement extends CanvasElement {
  type: 'plant';
  plantType?: 'tree' | 'bush' | 'potted' | 'hanging';
  size?: 'small' | 'medium' | 'large';
  potStyle?: 'ceramic' | 'wicker' | 'modern' | 'classic';
}

export interface BarElement extends CanvasElement {
  type: 'bar';
  barType?: 'straight' | 'L-shaped' | 'curved' | 'island';
  material?: 'wood' | 'marble' | 'granite' | 'steel';
  hasSeating?: boolean;
  seatCount?: number;
}

export interface ColumnElement extends CanvasElement {
  type: 'column';
  columnType?: 'round' | 'square' | 'decorative';
  diameter?: number;
  material?: 'concrete' | 'wood' | 'marble' | 'steel';
}

export interface StairsElement extends CanvasElement {
  type: 'stairs';
  direction?: 'up' | 'down';
  stepCount?: number;
  width: number;
  hasRailing?: boolean;
}

export interface ArtworkElement extends CanvasElement {
  type: 'artwork';
  artType?: 'painting' | 'sculpture' | 'photo' | 'mirror';
  width: number;
  height: number;
  frameStyle?: 'modern' | 'classic' | 'rustic' | 'none';
}

export interface CarpetElement extends CanvasElement {
  type: 'carpet';
  pattern?: 'solid' | 'geometric' | 'floral' | 'abstract';
  width: number;
  height: number;
  color?: string;
}

export interface FireplaceElement extends CanvasElement {
  type: 'fireplace';
  fireplaceType?: 'traditional' | 'modern' | 'corner' | 'hanging';
  width: number;
  height: number;
  isLit?: boolean;
}

export interface DiningArea {
  id: string;
  name: string;
  serviceHours: string[];
  color?: string;
  coordinates?: Array<{x: number; y: number}>;
  active?: boolean;
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
  floorTexture?: FloorTexture;
  layers?: RenderLayer[];
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

export interface RenderLayer {
  id: string;
  name: string;
  zIndex: number;
  visible: boolean;
  opacity: number;
  locked?: boolean;
}

export interface FloorTexture {
  id: string;
  name: string;
  type: 'wood' | 'tile' | 'carpet' | 'concrete' | 'marble';
  pattern?: string;
  color?: string;
}

export interface ElementTemplate {
  id: string;
  name: string;
  type: ElementType;
  icon: string;
  category: 'structural' | 'decorative' | 'furniture';
  defaultProperties: Partial<CanvasElement>;
}