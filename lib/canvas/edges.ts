import { CanvasEdge, CanvasNode } from '@/types';

// Get connection points on the boundary of the nodes to avoid lines crossing inside
function getConnectionPoints(source: CanvasNode, target: CanvasNode) {
  const sx = source.x + source.width / 2;
  const sy = source.y + source.height / 2;
  const tx = target.x + target.width / 2;
  const ty = target.y + target.height / 2;

  let startX = sx;
  let startY = sy;
  let endX = tx;
  let endY = ty;

  // Simple bounding box logic for connection points
  const dx = tx - sx;
  const dy = ty - sy;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection
    if (dx > 0) {
      startX = source.x + source.width;
      endX = target.x;
    } else {
      startX = source.x;
      endX = target.x + target.width;
    }
  } else {
    // Vertical connection
    if (dy > 0) {
      startY = source.y + source.height;
      endY = target.y;
    } else {
      startY = source.y;
      endY = target.y + target.height;
    }
  }

  return { startX, startY, endX, endY };
}

interface Point {
  x: number;
  y: number;
}

function getEdgePath(edge: CanvasEdge, source: CanvasNode, target: CanvasNode): Point[] {
  // 1. CloudFront to S3 (edge-cf-s3)
  if (edge.id === 'edge-cf-s3') {
    const startX = source.x + source.width / 2; // center of CloudFront horizontally
    const startY = source.y + source.height;     // bottom of CloudFront
    const endX = target.x;                       // left of S3
    const endY = target.y + 60;                  // S3 vertical center
    return [
      { x: startX, y: startY },
      { x: startX, y: endY },
      { x: endX, y: endY }
    ];
  }

  // 2. CloudFront to IGW (edge-cf-igw)
  if (edge.id === 'edge-cf-igw') {
    const startX = source.x + source.width;      // right of CloudFront
    const startY = source.y + 120;               // y-level inside CloudFront
    const endX = target.x;                       // left of IGW
    const endY = target.y + 40;                  // IGW center
    return [
      { x: startX, y: startY },
      { x: startX + 20, y: startY },             // move out right slightly
      { x: startX + 20, y: 60 },                 // go up above IAM
      { x: endX - 20, y: 60 },                   // go right past IAM to VPC corridor
      { x: endX - 20, y: endY },                 // go down
      { x: endX, y: endY }
    ];
  }

  // 3. Bob to S3 (edge-bob-s3)
  if (edge.id === 'edge-bob-s3') {
    const startX = source.x + source.width;      // right of Bob card
    const startY = source.y + source.height / 2; // 200
    const endX = target.x + 20;                  // top of S3, near left edge
    const endY = target.y;                       // 600
    return [
      { x: startX, y: startY },
      { x: 380, y: startY },                     // go right into corridor between IAM and VPC
      { x: 380, y: 580 },                        // go down corridor past containers
      { x: endX, y: 580 },                       // align with S3 landing X
      { x: endX, y: endY }
    ];
  }

  // 4. Web Server to S3 (edge-ec2-s3)
  if (edge.id === 'edge-ec2-s3') {
    const startX = source.x;                     // left of Web Server card
    const startY = source.y + source.height / 2; // 210
    const endX = target.x + 180;                 // top of S3, public subnet vertical line
    const endY = target.y;                       // 600
    return [
      { x: startX, y: startY },
      { x: 520, y: startY },                     // go left past subnet margin
      { x: 520, y: 580 },                        // go down past Web/NAT cards
      { x: endX, y: 580 },
      { x: endX, y: endY }
    ];
  }

  // 5. IAM Role to Web Server (edge-role-ec2)
  if (edge.id === 'edge-role-ec2') {
    const startX = source.x + source.width;      // right of Role card
    const startY = source.y + source.height / 2; // 320
    const endX = target.x;                       // left of Web Server card
    const endY = target.y + target.height / 2;
    return [
      { x: startX, y: startY },
      { x: 380, y: startY },                     // go right into IAM-VPC corridor
      { x: 380, y: endY },                       // go up/down in corridor
      { x: endX, y: endY }                       // connect to Web Server
    ];
  }

  // 6. User to IGW directly (edge-internet-igw)
  if (edge.id === 'edge-internet-igw') {
    const startX = source.x + source.width;      // right of Internet Client
    const startY = source.y + source.height / 2; // 260
    const endX = target.x;                       // left of IGW
    const endY = target.y + target.height / 2;   // 320
    return [
      { x: startX, y: startY },
      { x: -160, y: 520 },                       // go down below CloudFront
      { x: 420, y: 520 },                        // go right below IAM
      { x: 420, y: endY },                       // go up to IGW alignment
      { x: endX, y: endY }
    ];
  }

  // Default: straight line connection points
  const pts = getConnectionPoints(source, target);
  return [
    { x: pts.startX, y: pts.startY },
    { x: pts.endX, y: pts.endY }
  ];
}

export function drawEdge(
  ctx: CanvasRenderingContext2D,
  edge: CanvasEdge,
  nodes: CanvasNode[],
  isHighlighted: boolean,
  isActive: boolean,
  isDimmed: boolean,
  time: number
) {
  if (!isActive) return;

  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return;

  ctx.save();
  ctx.globalAlpha = isDimmed ? 0.2 : 1.0;

  // Get segmented path to route clean connections without overlapping cards
  const points = getEdgePath(edge, sourceNode, targetNode);

  // Line styling
  ctx.strokeStyle = isHighlighted ? '#3b82f6' : '#94a3b8';
  ctx.lineWidth = isHighlighted ? 3 : 1.5;

  if (edge.type === 'dashed') {
    ctx.setLineDash([4, 4]);
  } else {
    ctx.setLineDash([]);
  }

  // Draw line segments
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Reset line dash for arrow heads and labels
  ctx.setLineDash([]);

  // Draw Arrowhead at the end of the line
  const lastPoint = points[points.length - 1];
  const prevPoint = points[points.length - 2] || points[0];
  const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x);
  const arrowSize = isHighlighted ? 8 : 6;
  ctx.fillStyle = isHighlighted ? '#3b82f6' : '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(
    lastPoint.x - arrowSize * Math.cos(angle - Math.PI / 6),
    lastPoint.y - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    lastPoint.x - arrowSize * Math.cos(angle + Math.PI / 6),
    lastPoint.y - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Calculate total path length and segments lengths to find midpoint
  let totalLength = 0;
  const lengths: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i+1].x - points[i].x;
    const dy = points[i+1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    lengths.push(len);
    totalLength += len;
  }

  // Draw Label Badge at exact visual midpoint of the multi-segment line
  if (edge.label) {
    let mx = (points[0].x + points[points.length - 1].x) / 2;
    let my = (points[0].y + points[points.length - 1].y) / 2;

    const targetLen = totalLength / 2;
    let accumulated = 0;
    for (let i = 0; i < points.length - 1; i++) {
      if (accumulated + lengths[i] >= targetLen) {
        const ratio = (targetLen - accumulated) / lengths[i];
        mx = points[i].x + (points[i+1].x - points[i].x) * ratio;
        my = points[i].y + (points[i+1].y - points[i].y) * ratio;
        break;
      }
      accumulated += lengths[i];
    }

    ctx.font = '9px Inter, Roboto, sans-serif';
    const textWidth = ctx.measureText(edge.label).width;
    const paddingX = 6;
    const paddingY = 3;

    // Draw label box background
    ctx.fillStyle = 'white';
    ctx.strokeStyle = isHighlighted ? 'rgba(59, 130, 246, 0.4)' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(
      mx - textWidth / 2 - paddingX,
      my - 6 - paddingY,
      textWidth + paddingX * 2,
      12 + paddingY * 2,
      4
    );
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = isHighlighted ? '#1d4ed8' : '#475569';
    ctx.fillText(edge.label, mx - textWidth / 2, my + 4);
  }

  // Draw Animated Flow Particles
  if (!isDimmed && edge.type !== 'dashed') {
    const speed = isHighlighted ? 0.002 : 0.001;
    const progress = (time * speed) % 1.0;
    const particleCount = 2;
    ctx.fillStyle = isHighlighted ? '#60a5fa' : '#3b82f6';
    
    for (let pIdx = 0; pIdx < particleCount; pIdx++) {
      const pOffset = (progress + (pIdx / particleCount)) % 1.0;
      const targetDist = totalLength * pOffset;
      
      let currentDist = 0;
      let px = points[0].x;
      let py = points[0].y;
      
      for (let i = 0; i < points.length - 1; i++) {
        if (currentDist + lengths[i] >= targetDist) {
          const ratio = (targetDist - currentDist) / lengths[i];
          px = points[i].x + (points[i+1].x - points[i].x) * ratio;
          py = points[i].y + (points[i+1].y - points[i].y) * ratio;
          break;
        }
        currentDist += lengths[i];
      }

      ctx.beginPath();
      ctx.arc(px, py, isHighlighted ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
