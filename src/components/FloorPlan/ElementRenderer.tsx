import { 
  CanvasElement, 
  WallElement, 
  DoorElement, 
  WindowElement, 
  PlantElement, 
  BarElement, 
  ColumnElement, 
  StairsElement, 
  ArtworkElement, 
  CarpetElement, 
  FireplaceElement 
} from './types';

export class ElementRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  renderElement(element: CanvasElement): void {
    this.ctx.save();
    
    // Apply transformations
    this.ctx.translate(element.x, element.y);
    if (element.rotation) {
      this.ctx.rotate((element.rotation * Math.PI) / 180);
    }

    switch (element.type) {
      case 'wall':
        this.renderWall(element as WallElement);
        break;
      case 'door':
        this.renderDoor(element as DoorElement);
        break;
      case 'window':
        this.renderWindow(element as WindowElement);
        break;
      case 'plant':
        this.renderPlant(element as PlantElement);
        break;
      case 'bar':
        this.renderBar(element as BarElement);
        break;
      case 'column':
        this.renderColumn(element as ColumnElement);
        break;
      case 'stairs':
        this.renderStairs(element as StairsElement);
        break;
      case 'artwork':
        this.renderArtwork(element as ArtworkElement);
        break;
      case 'carpet':
        this.renderCarpet(element as CarpetElement);
        break;
      case 'fireplace':
        this.renderFireplace(element as FireplaceElement);
        break;
    }

    this.ctx.restore();
  }

  private renderWall(wall: WallElement): void {
    const thickness = wall.thickness || 8;
    const length = Math.sqrt((wall.endX - wall.x) ** 2 + (wall.endY - wall.y) ** 2);
    
    // Wall shadow
    this.ctx.shadowColor = 'hsla(220, 30%, 20%, 0.3)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetY = 2;
    
    // Wall body
    this.ctx.fillStyle = this.getMaterialColor(wall.material || 'concrete');
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 1;
    
    this.ctx.fillRect(-thickness/2, 0, thickness, length);
    this.ctx.strokeRect(-thickness/2, 0, thickness, length);
    
    // Add texture based on material
    this.addWallTexture(wall.material || 'concrete', thickness, length);
  }

  private renderDoor(door: DoorElement): void {
    const width = door.width || 80;
    const height = 20;
    
    // Door frame
    this.ctx.fillStyle = 'hsl(var(--muted))';
    this.ctx.fillRect(-width/2, -height/2, width, height);
    
    // Door itself
    this.ctx.fillStyle = this.getDoorColor(door.doorType || 'single');
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4);
    this.ctx.strokeRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4);
    
    // Door handle
    this.ctx.fillStyle = 'hsl(var(--primary))';
    const handleX = door.openDirection === 'left' ? width/3 : -width/3;
    this.ctx.fillRect(handleX - 2, -2, 4, 4);
    
    // Opening arc for swing doors
    if (door.doorType !== 'sliding') {
      this.ctx.strokeStyle = 'hsla(217, 91%, 50%, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([2, 2]);
      this.ctx.beginPath();
      this.ctx.arc(door.openDirection === 'left' ? -width/2 : width/2, 0, width, 0, Math.PI/2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  private renderWindow(window: WindowElement): void {
    const width = window.width || 100;
    const height = window.height || 60;
    
    // Window frame
    if (window.hasFrame !== false) {
      this.ctx.fillStyle = 'hsl(var(--muted))';
      this.ctx.fillRect(-width/2 - 4, -height/2 - 4, width + 8, height + 8);
    }
    
    // Glass area with reflection effect
    const gradient = this.ctx.createLinearGradient(-width/2, -height/2, width/2, height/2);
    gradient.addColorStop(0, 'hsla(200, 100%, 85%, 0.7)');
    gradient.addColorStop(0.5, 'hsla(200, 100%, 95%, 0.4)');
    gradient.addColorStop(1, 'hsla(200, 100%, 75%, 0.6)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(-width/2, -height/2, width, height);
    
    // Window panes
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Cross dividers
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height/2);
    this.ctx.lineTo(0, height/2);
    this.ctx.moveTo(-width/2, 0);
    this.ctx.lineTo(width/2, 0);
    this.ctx.stroke();
  }

  private renderPlant(plant: PlantElement): void {
    const size = this.getPlantSize(plant.size || 'medium');
    
    // Pot
    this.ctx.fillStyle = this.getPotColor(plant.potStyle || 'ceramic');
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 1;
    
    this.ctx.fillRect(-size/3, size/3, size*2/3, size/3);
    this.ctx.strokeRect(-size/3, size/3, size*2/3, size/3);
    
    // Plant based on type
    switch (plant.plantType) {
      case 'tree':
        this.renderTree(size);
        break;
      case 'bush':
        this.renderBush(size);
        break;
      case 'potted':
      default:
        this.renderPottedPlant(size);
        break;
    }
  }

  private renderBar(bar: BarElement): void {
    const width = bar.width || 200;
    const height = bar.height || 60;
    
    // Bar shadow
    this.ctx.shadowColor = 'hsla(220, 30%, 20%, 0.4)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowOffsetY = 3;
    
    // Bar surface
    this.ctx.fillStyle = this.getBarMaterialColor(bar.material || 'wood');
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(-width/2, -height/2, width, height);
    this.ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Bar edge highlight
    const gradient = this.ctx.createLinearGradient(-width/2, -height/2, -width/2, height/2);
    gradient.addColorStop(0, 'hsla(217, 91%, 50%, 0.2)');
    gradient.addColorStop(1, 'hsla(217, 91%, 50%, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(-width/2, -height/2, width, 10);
    
    // Stools if specified
    if (bar.hasSeating && bar.seatCount) {
      this.renderBarStools(bar.seatCount, width, height);
    }
  }

  private renderColumn(column: ColumnElement): void {
    const diameter = column.diameter || 40;
    const radius = diameter / 2;
    
    // Column shadow
    this.ctx.shadowColor = 'hsla(220, 30%, 20%, 0.4)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 3;
    
    // Column body
    this.ctx.fillStyle = this.getMaterialColor(column.material || 'concrete');
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 2;
    
    if (column.columnType === 'round') {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.fillRect(-radius, -radius, diameter, diameter);
      this.ctx.strokeRect(-radius, -radius, diameter, diameter);
    }
    
    // Decorative details for decorative columns
    if (column.columnType === 'decorative') {
      this.addColumnDecorations(radius);
    }
  }

  private renderStairs(stairs: StairsElement): void {
    const width = stairs.width || 100;
    const stepCount = stairs.stepCount || 8;
    const stepHeight = 80 / stepCount;
    
    // Stairs shadow
    this.ctx.shadowColor = 'hsla(220, 30%, 20%, 0.3)';
    this.ctx.shadowBlur = 4;
    
    // Draw each step
    for (let i = 0; i < stepCount; i++) {
      const y = i * stepHeight;
      const stepWidth = width - (i * 2); // Perspective effect
      
      this.ctx.fillStyle = i % 2 === 0 ? 'hsl(var(--muted))' : 'hsl(var(--muted-foreground))';
      this.ctx.fillRect(-stepWidth/2, y, stepWidth, stepHeight);
      
      this.ctx.strokeStyle = 'hsl(var(--border))';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(-stepWidth/2, y, stepWidth, stepHeight);
    }
    
    // Railing if specified
    if (stairs.hasRailing) {
      this.renderRailing(width, stepCount * stepHeight);
    }
    
    // Direction arrow
    this.renderDirectionArrow(stairs.direction || 'up', width);
  }

  private renderArtwork(artwork: ArtworkElement): void {
    const width = artwork.width || 80;
    const height = artwork.height || 60;
    
    // Frame
    if (artwork.frameStyle !== 'none') {
      const frameWidth = 6;
      this.ctx.fillStyle = this.getFrameColor(artwork.frameStyle || 'modern');
      this.ctx.fillRect(-width/2 - frameWidth, -height/2 - frameWidth, width + frameWidth*2, height + frameWidth*2);
    }
    
    // Artwork content based on type
    switch (artwork.artType) {
      case 'mirror':
        const gradient = this.ctx.createLinearGradient(-width/2, -height/2, width/2, height/2);
        gradient.addColorStop(0, 'hsla(200, 50%, 90%, 0.8)');
        gradient.addColorStop(1, 'hsla(200, 50%, 70%, 0.6)');
        this.ctx.fillStyle = gradient;
        break;
      case 'painting':
        this.ctx.fillStyle = 'hsl(var(--accent))';
        break;
      default:
        this.ctx.fillStyle = 'hsl(var(--muted))';
    }
    
    this.ctx.fillRect(-width/2, -height/2, width, height);
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-width/2, -height/2, width, height);
  }

  private renderCarpet(carpet: CarpetElement): void {
    const width = carpet.width || 120;
    const height = carpet.height || 80;
    
    // Carpet shadow
    this.ctx.shadowColor = 'hsla(220, 30%, 20%, 0.2)';
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetY = 1;
    
    // Carpet base
    this.ctx.fillStyle = carpet.color || 'hsl(var(--accent))';
    this.ctx.fillRect(-width/2, -height/2, width, height);
    
    // Pattern overlay
    this.addCarpetPattern(carpet.pattern || 'solid', width, height);
    
    // Carpet border
    this.ctx.strokeStyle = 'hsla(var(--border-rgb), 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-width/2, -height/2, width, height);
  }

  private renderFireplace(fireplace: FireplaceElement): void {
    const width = fireplace.width || 120;
    const height = fireplace.height || 100;
    
    // Fireplace body
    this.ctx.fillStyle = 'hsl(var(--muted))';
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(-width/2, -height/2, width, height);
    this.ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Fireplace opening
    const openingWidth = width * 0.7;
    const openingHeight = height * 0.6;
    
    this.ctx.fillStyle = fireplace.isLit ? 'hsl(20, 80%, 40%)' : 'hsl(0, 0%, 20%)';
    this.ctx.fillRect(-openingWidth/2, -openingHeight/2, openingWidth, openingHeight);
    
    // Fire effect if lit
    if (fireplace.isLit) {
      this.renderFire(openingWidth, openingHeight);
    }
    
    // Mantle
    this.ctx.fillStyle = 'hsl(var(--muted-foreground))';
    this.ctx.fillRect(-width/2, -height/2, width, 8);
  }

  // Helper methods for materials and colors
  private getMaterialColor(material: string): string {
    switch (material) {
      case 'brick': return 'hsl(15, 45%, 65%)';
      case 'wood': return 'hsl(30, 40%, 55%)';
      case 'glass': return 'hsla(200, 100%, 85%, 0.6)';
      case 'concrete': return 'hsl(0, 0%, 75%)';
      default: return 'hsl(var(--muted))';
    }
  }

  private getDoorColor(doorType: string): string {
    switch (doorType) {
      case 'glass': return 'hsla(200, 100%, 85%, 0.7)';
      case 'wood': return 'hsl(30, 40%, 45%)';
      default: return 'hsl(var(--card))';
    }
  }

  private getPlantSize(size: string): number {
    switch (size) {
      case 'small': return 20;
      case 'large': return 50;
      default: return 35; // medium
    }
  }

  private getPotColor(potStyle: string): string {
    switch (potStyle) {
      case 'ceramic': return 'hsl(25, 60%, 85%)';
      case 'wicker': return 'hsl(35, 45%, 65%)';
      case 'modern': return 'hsl(0, 0%, 60%)';
      default: return 'hsl(20, 30%, 70%)'; // classic
    }
  }

  private getBarMaterialColor(material: string): string {
    switch (material) {
      case 'marble': return 'hsl(0, 0%, 90%)';
      case 'granite': return 'hsl(0, 0%, 50%)';
      case 'steel': return 'hsl(210, 15%, 70%)';
      default: return 'hsl(30, 40%, 50%)'; // wood
    }
  }

  private getFrameColor(frameStyle: string): string {
    switch (frameStyle) {
      case 'classic': return 'hsl(45, 60%, 40%)';
      case 'rustic': return 'hsl(30, 30%, 35%)';
      case 'modern': return 'hsl(0, 0%, 30%)';
      default: return 'hsl(0, 0%, 60%)';
    }
  }

  // Additional rendering methods for complex elements
  private renderTree(size: number): void {
    // Trunk
    this.ctx.fillStyle = 'hsl(30, 40%, 40%)';
    this.ctx.fillRect(-size/8, 0, size/4, size/2);
    
    // Foliage
    this.ctx.fillStyle = 'hsl(120, 60%, 35%)';
    this.ctx.beginPath();
    this.ctx.arc(0, -size/4, size/2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private renderBush(size: number): void {
    this.ctx.fillStyle = 'hsl(120, 50%, 40%)';
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * size/4;
      const radius = size/3 + Math.random() * size/6;
      this.ctx.beginPath();
      this.ctx.arc(x, 0, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private renderPottedPlant(size: number): void {
    // Plant stems
    this.ctx.strokeStyle = 'hsl(120, 60%, 30%)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * size/6;
      this.ctx.beginPath();
      this.ctx.moveTo(x, size/3);
      this.ctx.lineTo(x + Math.random() * 10 - 5, -size/3);
      this.ctx.stroke();
    }
    
    // Leaves
    this.ctx.fillStyle = 'hsl(120, 60%, 40%)';
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * size - size/2;
      const y = Math.random() * size/2 - size/4;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size/8, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private renderBarStools(count: number, barWidth: number, barHeight: number): void {
    const spacing = barWidth / (count + 1);
    
    for (let i = 0; i < count; i++) {
      const x = -barWidth/2 + spacing * (i + 1);
      const y = barHeight/2 + 25;
      
      // Stool seat
      this.ctx.fillStyle = 'hsl(var(--muted))';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
      this.ctx.fill();
      
      // Stool leg
      this.ctx.strokeStyle = 'hsl(var(--border))';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + 20);
      this.ctx.stroke();
    }
  }

  private addColumnDecorations(radius: number): void {
    // Add decorative rings
    this.ctx.strokeStyle = 'hsla(217, 91%, 50%, 0.3)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius - i * 5, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }

  private renderRailing(width: number, height: number): void {
    // Railing posts
    this.ctx.strokeStyle = 'hsl(var(--border))';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(-width/2, 0);
    this.ctx.lineTo(-width/2, -height);
    this.ctx.moveTo(width/2, 0);
    this.ctx.lineTo(width/2, -height);
    this.ctx.stroke();
    
    // Railing top
    this.ctx.beginPath();
    this.ctx.moveTo(-width/2, -height);
    this.ctx.lineTo(width/2, -height);
    this.ctx.stroke();
  }

  private renderDirectionArrow(direction: string, width: number): void {
    this.ctx.fillStyle = 'hsl(var(--primary))';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const arrow = direction === 'up' ? '↑' : '↓';
    this.ctx.fillText(arrow, 0, -10);
  }

  private renderFire(width: number, height: number): void {
    // Animated fire effect
    const gradient = this.ctx.createRadialGradient(0, height/4, 0, 0, 0, height/2);
    gradient.addColorStop(0, 'hsl(60, 100%, 70%)');
    gradient.addColorStop(0.5, 'hsl(20, 100%, 60%)');
    gradient.addColorStop(1, 'hsl(0, 100%, 50%)');
    
    this.ctx.fillStyle = gradient;
    
    // Multiple flame shapes
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * width/4;
      this.ctx.beginPath();
      this.ctx.moveTo(x, height/4);
      this.ctx.quadraticCurveTo(x - 10, 0, x, -height/4);
      this.ctx.quadraticCurveTo(x + 10, 0, x, height/4);
      this.ctx.fill();
    }
  }

  private addWallTexture(material: string, thickness: number, length: number): void {
    this.ctx.strokeStyle = 'hsla(var(--border-rgb), 0.3)';
    this.ctx.lineWidth = 0.5;
    
    switch (material) {
      case 'brick':
        // Brick pattern
        const brickHeight = 8;
        const brickWidth = 16;
        for (let y = 0; y < length; y += brickHeight) {
          const offset = (Math.floor(y / brickHeight) % 2) * brickWidth / 2;
          for (let x = offset; x < thickness; x += brickWidth) {
            this.ctx.strokeRect(-thickness/2 + x, y, Math.min(brickWidth, thickness - x), brickHeight);
          }
        }
        break;
      case 'wood':
        // Wood grain lines
        for (let i = 0; i < 3; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(-thickness/2 + i * thickness/3, 0);
          this.ctx.lineTo(-thickness/2 + i * thickness/3, length);
          this.ctx.stroke();
        }
        break;
    }
  }

  private addCarpetPattern(pattern: string, width: number, height: number): void {
    this.ctx.strokeStyle = 'hsla(var(--border-rgb), 0.4)';
    this.ctx.lineWidth = 1;
    
    switch (pattern) {
      case 'geometric':
        // Diamond pattern
        const spacing = 20;
        for (let x = -width/2; x < width/2; x += spacing) {
          for (let y = -height/2; y < height/2; y += spacing) {
            this.ctx.strokeRect(x, y, spacing/2, spacing/2);
          }
        }
        break;
      case 'floral':
        // Simple flower pattern
        for (let x = -width/2 + 20; x < width/2; x += 40) {
          for (let y = -height/2 + 20; y < height/2; y += 40) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.stroke();
          }
        }
        break;
    }
  }
}