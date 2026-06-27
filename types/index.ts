export interface CameraPosition {
  x: number;
  y: number;
  zoom: number;
}

export interface Annotation {
  nodeId: string;
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
}

export interface StepAnimation {
  fromNodeId: string;
  toNodeId: string;
  particleCount?: number;
  color?: string;
  label?: string;
}

export interface Step {
  id: string;
  title?: string;
  text: string; // Keep as string (HTML/Markdown supported) to make it serializable and clean
  activeNodes?: string[];
  activeEdges?: string[];
  highlightNodes?: string[];
  highlightEdges?: string[];
  camera: CameraPosition;
  annotations?: Annotation[];
  animation?: StepAnimation;
}

export interface Chapter {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  steps: Step[];
  estimatedMinutes: number;
}

export interface CanvasNode {
  id: string;
  type: 'aws-account' | 'iam-user' | 'iam-role' | 'iam-policy' | 'vpc' | 'subnet-public' | 'subnet-private' | 'ec2' | 's3' | 'cloudfront' | 'internet' | 'igw' | 'nat-gateway' | 'route-table' | 'security-group';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
  properties?: Record<string, string>;
  status?: string;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'dashed' | 'bidirectional';
}
