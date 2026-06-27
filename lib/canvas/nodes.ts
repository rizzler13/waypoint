import { CanvasNode } from '@/types';
import { COLORS } from './layout';

// Helper to draw rounded rectangle
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draw custom service icons using canvas vector paths
function drawServiceIcon(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const xc = x + size / 2;
  const yc = y + size / 2;

  switch (type) {
    case 'internet':
      // Globe/Cloud symbol
      ctx.beginPath();
      ctx.arc(xc, yc, size * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(xc, yc, size * 0.15, size * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - size * 0.35, yc);
      ctx.lineTo(xc + size * 0.35, yc);
      ctx.stroke();
      break;

    case 'cloudfront':
      // CDN / Edge waves
      ctx.beginPath();
      ctx.arc(xc, yc, size * 0.35, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xc, yc, size * 0.2, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xc, yc, size * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Server tower
      ctx.strokeRect(xc - size * 0.35, yc - size * 0.35, size * 0.3, size * 0.7);
      break;

    case 'iam-user':
      // User avatar silhouette
      ctx.beginPath();
      ctx.arc(xc, yc - size * 0.15, size * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xc, yc + size * 0.35, size * 0.35, Math.PI, Math.PI * 2);
      ctx.stroke();
      break;

    case 'iam-role':
      // Badge/Key shield
      ctx.beginPath();
      ctx.moveTo(xc, yc - size * 0.4);
      ctx.lineTo(xc + size * 0.35, yc - size * 0.25);
      ctx.lineTo(xc + size * 0.3, yc + size * 0.15);
      ctx.lineTo(xc, yc + size * 0.4);
      ctx.lineTo(xc - size * 0.3, yc + size * 0.15);
      ctx.lineTo(xc - size * 0.35, yc - size * 0.25);
      ctx.closePath();
      ctx.stroke();
      // Key hole inside
      ctx.beginPath();
      ctx.arc(xc, yc - size * 0.05, size * 0.1, 0, Math.PI * 2);
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc - size * 0.1, yc + size * 0.25);
      ctx.lineTo(xc + size * 0.1, yc + size * 0.25);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'iam-policy':
      // Document with lines
      ctx.strokeRect(xc - size * 0.3, yc - size * 0.4, size * 0.6, size * 0.8);
      ctx.beginPath();
      ctx.moveTo(xc - size * 0.15, yc - size * 0.15);
      ctx.lineTo(xc + size * 0.15, yc - size * 0.15);
      ctx.moveTo(xc - size * 0.15, yc + size * 0.05);
      ctx.lineTo(xc + size * 0.15, yc + size * 0.05);
      ctx.stroke();
      break;

    case 'igw':
      // Gateway arrow loop
      ctx.beginPath();
      ctx.arc(xc, yc, size * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - size * 0.2, yc);
      ctx.lineTo(xc + size * 0.2, yc);
      ctx.moveTo(xc + size * 0.05, yc - size * 0.15);
      ctx.lineTo(xc + size * 0.2, yc);
      ctx.lineTo(xc + size * 0.05, yc + size * 0.15);
      ctx.stroke();
      break;

    case 'ec2':
      // Orange box server
      ctx.strokeRect(xc - size * 0.3, yc - size * 0.3, size * 0.6, size * 0.6);
      ctx.beginPath();
      ctx.moveTo(xc - size * 0.3, yc - size * 0.1);
      ctx.lineTo(xc + size * 0.3, yc - size * 0.1);
      ctx.moveTo(xc - size * 0.3, yc + size * 0.1);
      ctx.lineTo(xc + size * 0.3, yc + size * 0.1);
      ctx.stroke();
      break;

    case 'nat-gateway':
      // Two interlocking circle arrows
      ctx.beginPath();
      ctx.arc(xc - size * 0.12, yc, size * 0.2, 0, Math.PI * 2);
      ctx.arc(xc + size * 0.12, yc, size * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 's3':
      // Bucket cylinder
      ctx.beginPath();
      ctx.ellipse(xc, yc - size * 0.25, size * 0.3, size * 0.1, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - size * 0.3, yc - size * 0.25);
      ctx.lineTo(xc - size * 0.3, yc + size * 0.25);
      ctx.arcTo(xc, yc + size * 0.35, xc + size * 0.3, yc + size * 0.25, size * 0.3);
      ctx.lineTo(xc + size * 0.3, yc - size * 0.25);
      ctx.stroke();
      break;

    default:
      // Generic box
      ctx.strokeRect(xc - size * 0.3, yc - size * 0.3, size * 0.6, size * 0.6);
  }
  ctx.restore();
}

export function drawNode(
  ctx: CanvasRenderingContext2D,
  node: CanvasNode,
  isHighlighted: boolean,
  isActive: boolean,
  isDimmed: boolean,
  zoom: number
) {
  if (!isActive) return;

  ctx.save();

  // Set opacity based on dimmed state
  ctx.globalAlpha = isDimmed ? 0.3 : 1.0;

  // Retrieve matching color palette
  const colors = COLORS[node.type as keyof typeof COLORS] || COLORS.internet;

  const isContainer = [
    'aws-account',
    'vpc',
    'subnet-public',
    'subnet-private',
    'iam-role' // using iam-box container
  ].includes(node.id) || node.type === 'vpc' || node.type === 'subnet-public' || node.type === 'subnet-private' || node.id === 'iam-box';

  if (isContainer) {
    // Container nodes (VPC, Subnet, AWS Account)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = colors.bg;
    ctx.strokeStyle = isHighlighted ? '#3b82f6' : colors.border;
    ctx.lineWidth = isHighlighted ? 3 : 1.5;

    // Dashed subnets / public/private separators
    if (node.type.startsWith('subnet')) {
      ctx.setLineDash([6, 4]);
    } else {
      ctx.setLineDash([]);
    }

    drawRoundedRect(ctx, node.x, node.y, node.width, node.height, 12);
    ctx.fill();
    ctx.stroke();

    // Reset dash for labels
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Header Label Bar
    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 11px Inter, Roboto, sans-serif';
    ctx.fillText(node.label, node.x + 12, node.y + 20);

    // Extra metadata for container
    if (node.properties && zoom > 0.5) {
      ctx.fillStyle = colors.text;
      ctx.font = '9px monospace, Courier New';
      let metaStr = '';
      if (node.properties.CIDR) metaStr = node.properties.CIDR;
      else if (node.properties.Gateway) metaStr = node.properties.Gateway;
      
      if (metaStr) {
        if (node.type.startsWith('subnet')) {
          // Render below the label for narrow subnets to avoid text overlaps
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillText(metaStr, node.x + 12, node.y + 32);
        } else {
          ctx.fillText(metaStr, node.x + node.width - ctx.measureText(metaStr).width - 12, node.y + 20);
        }
      }
    }
  } else {
    // Leaf resource nodes (EC2, S3, Users, Policies, Gateways)
    const isSpecialGateway = node.type === 'igw';
    const radius = isSpecialGateway ? node.width / 2 : 10;

    // Dropshadow
    ctx.shadowColor = isHighlighted ? 'rgba(59, 130, 246, 0.35)' : 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = isHighlighted ? 12 : 6;
    ctx.shadowOffsetY = isHighlighted ? 4 : 2;

    ctx.fillStyle = colors.bg;
    ctx.strokeStyle = isHighlighted ? '#3b82f6' : colors.border;
    ctx.lineWidth = isHighlighted ? 3 : 1.5;

    // Draw card background
    if (isSpecialGateway) {
      ctx.beginPath();
      ctx.arc(node.x + radius, node.y + radius, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      drawRoundedRect(ctx, node.x, node.y, node.width, node.height, radius);
      ctx.fill();
      ctx.stroke();
    }

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'transparent';

    // Left colored accent indicator bar
    if (!isSpecialGateway) {
      ctx.fillStyle = colors.accent;
      drawRoundedRect(ctx, node.x + 2, node.y + 2, 4, node.height - 4, 2);
      ctx.fill();
    }

    // Vector icons and labels drawing below

    // Draw Vector Icon
    const iconSize = isSpecialGateway ? 36 : 24;
    const iconX = isSpecialGateway
      ? node.x + node.width / 2 - iconSize / 2
      : node.x + 12;
    const iconY = isSpecialGateway
      ? node.y + node.height / 2 - iconSize / 2
      : node.y + 10;
    drawServiceIcon(ctx, node.type, iconX, iconY, iconSize, colors.accent);

    // Label Text
    if (!isSpecialGateway) {
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 11px Inter, Roboto, sans-serif';
      ctx.fillText(node.label, node.x + 44, node.y + 20);

      // Properties List (drawn inside card at high zoom)
      if (node.properties && zoom > 0.75) {
        ctx.font = '9px monospace, Courier';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        
        let py = node.y + 36;
        Object.entries(node.properties).slice(0, 3).forEach(([k, v]) => {
          const text = `${k}: ${v}`;
          // Dynamic visual truncation based on exact rendering measurements
          let display = text;
          const maxW = node.width - 52;
          if (ctx.measureText(display).width > maxW) {
            while (display.length > 0 && ctx.measureText(display + '...').width > maxW) {
              display = display.slice(0, -1);
            }
            display += '...';
          }
          ctx.fillText(display, node.x + 44, py);
          py += 12;
        });
      } else if (!node.properties || zoom <= 0.75) {
        // Draw secondary subtext under name if properties are hidden
        ctx.font = '9px Inter, Roboto, sans-serif';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillText(node.type.toUpperCase(), node.x + 44, node.y + 32);
      }
    }
  }

  ctx.restore();
}
