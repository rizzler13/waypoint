import { Camera } from './camera';
import { drawNode } from './nodes';
import { drawEdge } from './edges';
import { CanvasNode, CanvasEdge, Annotation, CameraPosition } from '@/types';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  // Interaction State
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private cameraStartX: number = 0;
  private cameraStartY: number = 0;

  // Configuration and Data
  public nodes: CanvasNode[] = [];
  public edges: CanvasEdge[] = [];
  public activeNodes: string[] = [];
  public activeEdges: string[] = [];
  public highlightNodes: string[] = [];
  public highlightEdges: string[] = [];
  public annotations: Annotation[] = [];

  // Callbacks
  public onNodeClick?: (nodeId: string) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.camera = new Camera({ x: 0, y: 0, zoom: 0.85 });

    this.setupEvents();
    this.startLoop();
  }

  public resize(width: number, height: number) {
    // Handle Retina displays (High DPI)
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
    this.draw();
  }

  public setCameraTarget(pos: CameraPosition) {
    this.camera.setTarget(-pos.x * pos.zoom, -pos.y * pos.zoom, pos.zoom);
  }

  public fitToScreen(padding = 50) {
    if (this.nodes.length === 0) return;

    // Filter active nodes to fit
    const activeNodesList = this.nodes.filter(n => this.activeNodes.includes(n.id));
    if (activeNodesList.length === 0) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    activeNodesList.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + n.height);
    });

    const w = maxX - minX;
    const h = maxY - minY;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    this.camera.centerOnBox(minX, minY, w, h, width, height, padding);
  }

  private setupEvents() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
  }

  public cleanupEvents() {
    this.stopLoop();
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
  }

  private handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Check if clicked a node
    const canvasCoords = this.camera.toCanvasCoords(clientX, clientY, width, height);
    const clickedNode = [...this.nodes]
      .reverse() // check top-most first
      .find(n => {
        if (!this.activeNodes.includes(n.id)) return false;
        
        // Don't register click on massive containers like aws-account unless specifically desired
        if (n.id === 'aws-account') return false;

        return (
          canvasCoords.x >= n.x &&
          canvasCoords.x <= n.x + n.width &&
          canvasCoords.y >= n.y &&
          canvasCoords.y <= n.y + n.height
        );
      });

    if (clickedNode && this.onNodeClick) {
      this.onNodeClick(clickedNode.id);
      return;
    }

    // Default pan behavior
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.cameraStartX = this.camera.x;
    this.cameraStartY = this.camera.y;
    this.canvas.style.cursor = 'grabbing';
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    // Direct pan manipulation updates both current and target camera positions
    this.camera.jumpTo(
      this.cameraStartX + dx,
      this.cameraStartY + dy,
      this.camera.zoom
    );
  }

  private handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.canvas.style.cursor = 'default';
    }
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    const zoomFactor = 1.1;
    const currentZoom = this.camera.zoom;
    const newZoom = e.deltaY < 0 ? currentZoom * zoomFactor : currentZoom / zoomFactor;

    // Zoom centered on mouse pointer logic
    const cx = width / 2;
    const cy = height / 2;
    
    // Position of mouse in canvas coordinates before zoom change
    const mxCanvas = (mouseX - cx - this.camera.x) / currentZoom;
    const myCanvas = (mouseY - cy - this.camera.y) / currentZoom;

    const targetX = mouseX - cx - mxCanvas * newZoom;
    const targetY = mouseY - cy - myCanvas * newZoom;

    this.camera.setTarget(targetX, targetY, newZoom);
  }

  private startLoop() {
    const loop = (timestamp: number) => {
      this.lastTime = timestamp;
      this.camera.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private draw() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const ctx = this.ctx;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Light Gray Canvas Background
    ctx.fillStyle = '#f8fafc'; // slate 50
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    
    // Apply Camera Transform
    ctx.translate(width / 2 + this.camera.x, height / 2 + this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // Draw Subtle Grid Pattern (Dots)
    this.drawDotGrid(ctx, -2000, -2000, 4000, 4000, 40);

    // Draw Edges First (so they sit below nodes)
    const activeEdgesList = this.edges.filter(e => this.activeEdges.includes(e.id));

    // Draw active edges first
    activeEdgesList.forEach(edge => {
      const isHighlighted = this.highlightEdges.includes(edge.id);
      drawEdge(ctx, edge, this.nodes, isHighlighted, true, false, this.lastTime);
    });

    // Draw Nodes (Containers first, then leaf nodes)
    // Sort so container nodes (bigger size) are drawn first and leaf nodes on top
    const sortedNodes = [...this.nodes].sort((a, b) => {
      const aIsContainer = (a.width * a.height) > 60000;
      const bIsContainer = (b.width * b.height) > 60000;
      if (aIsContainer && !bIsContainer) return -1;
      if (!aIsContainer && bIsContainer) return 1;
      return 0;
    });

    // Determine dimmed nodes (nodes active, but NOT in current chapter's highlights or focus)
    // A node is dimmed if we are focusing on other things, e.g. if highlightNodes is set and non-empty,
    // and this node is active but not highlighted.
    const hasHighlights = this.highlightNodes && this.highlightNodes.length > 0;

    sortedNodes.forEach(node => {
      const isActive = this.activeNodes.includes(node.id);
      const isHighlighted = this.highlightNodes.includes(node.id);
      const isDimmed = isActive && hasHighlights && !isHighlighted;
      
      drawNode(ctx, node, isHighlighted, isActive, isDimmed, this.camera.zoom);
    });

    // Draw Annotations / Tooltips
    if (this.annotations && this.annotations.length > 0) {
      this.drawAnnotations(ctx);
    }

    ctx.restore();
  }

  private drawDotGrid(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, size: number) {
    ctx.save();
    ctx.fillStyle = '#e2e8f0'; // slate 200 grid
    
    // Determine bounds based on camera limits
    const startX = Math.floor(x / size) * size;
    const startY = Math.floor(y / size) * size;
    const endX = x + w;
    const endY = y + h;

    for (let gx = startX; gx < endX; gx += size) {
      for (let gy = startY; gy < endY; gy += size) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawAnnotations(ctx: CanvasRenderingContext2D) {
    this.annotations.forEach(ann => {
      const targetNode = this.nodes.find(n => n.id === ann.nodeId);
      if (!targetNode || !this.activeNodes.includes(targetNode.id)) return;

      ctx.save();
      
      const nx = targetNode.x + targetNode.width / 2;
      const ny = targetNode.y; // top center of node

      // Style tooltip annotation bubble
      ctx.font = 'bold 9px monospace';
      const textWidth = ctx.measureText(ann.label).width;
      const bubbleW = textWidth + 12;
      const bubbleH = 18;
      const bubbleX = nx - bubbleW / 2;
      const bubbleY = ny - bubbleH - 12; // 12px gap

      // Draw pointer line
      ctx.strokeStyle = ann.color || '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.lineTo(nx, bubbleY + bubbleH);
      ctx.stroke();

      // Draw tooltip body
      ctx.fillStyle = '#1e293b'; // dark slate
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 4);
      ctx.fill();

      // Draw text
      ctx.fillStyle = '#f8fafc'; // light slate
      ctx.fillText(ann.label, bubbleX + 6, bubbleY + 12);

      ctx.restore();
    });
  }
}
