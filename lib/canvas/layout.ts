import { CanvasNode, CanvasEdge } from '@/types';

// Palette colors for nodes and borders
export const COLORS = {
  internet: { bg: '#e5e7eb', border: '#9ca3af', text: '#1f2937', accent: '#6b7280' },
  cloudfront: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', accent: '#2563eb' },
  awsAccount: { bg: '#fffbeb', border: '#f59e0b', text: '#78350f', accent: '#d97706' },
  iam: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d', accent: '#dc2626' },
  vpc: { bg: '#f0fdf4', border: '#22c55e', text: '#14532d', accent: '#16a34a' },
  subnetPublic: { bg: '#ecfdf5', border: '#10b981', text: '#064e3b', accent: '#059669' },
  subnetPrivate: { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e', accent: '#0284c7' },
  ec2: { bg: '#ffedd5', border: '#f97316', text: '#7c2d12', accent: '#ea580c' },
  s3: { bg: '#faf5ff', border: '#a855f7', text: '#581c87', accent: '#9333ea' },
  igw: { bg: '#ecfdf5', border: '#10b981', text: '#064e3b', accent: '#059669' },
  nat: { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', accent: '#d97706' },
};

export const INITIAL_NODES: CanvasNode[] = [
  // External
  {
    id: 'internet',
    type: 'internet',
    label: 'Internet Clients',
    x: -360,
    y: 200,
    width: 140,
    height: 120,
    properties: {
      'Source': 'User Browsers',
      'Protocol': 'HTTPS/TCP'
    }
  },
  {
    id: 'cloudfront',
    type: 'cloudfront',
    label: 'CloudFront CDN',
    x: -160,
    y: 120,
    width: 180,
    height: 280,
    properties: {
      'Distribution': 'd2abc123.cloudfront.net',
      'Edge Locations': '450+ globally',
      'SSL/TLS': 'ACM Cert Active',
      'Cache Policy': 'CachingOptimized'
    }
  },
  
  // AWS Account Container
  {
    id: 'aws-account',
    type: 'aws-account',
    label: 'AWS Account (123456789012)',
    x: 80,
    y: 40,
    width: 1040,
    height: 720,
  },

  // IAM Container
  {
    id: 'iam-box',
    type: 'iam-role', // custom category container
    label: 'IAM (Identity & Access Management)',
    x: 120,
    y: 80,
    width: 240,
    height: 480,
    parentId: 'aws-account'
  },
  {
    id: 'iam-user',
    type: 'iam-user',
    label: 'Bob (IAM User)',
    x: 140,
    y: 160,
    width: 200,
    height: 80,
    parentId: 'iam-box',
    properties: {
      'ARN': 'arn:aws:iam::123:user/bob',
      'MFADevice': 'Virtual TOTP',
      'Groups': 'Developers'
    }
  },
  {
    id: 'iam-role',
    type: 'iam-role',
    label: 'EC2-S3-Read-Role',
    x: 140,
    y: 280,
    width: 200,
    height: 80,
    parentId: 'iam-box',
    properties: {
      'ARN': 'arn:aws:iam::123:role/s3-reader',
      'TrustedEntity': 'ec2.amazonaws.com'
    }
  },
  {
    id: 'iam-policy',
    type: 'iam-policy',
    label: 'S3-ReadOnly-Policy',
    x: 140,
    y: 400,
    width: 200,
    height: 80,
    parentId: 'iam-box',
    properties: {
      'Effect': 'Allow',
      'Action': 's3:Get*, s3:List*',
      'Resource': 'arn:aws:s3:::my-app-assets/*'
    }
  },

  // VPC Container
  {
    id: 'vpc',
    type: 'vpc',
    label: 'VPC',
    x: 400,
    y: 80,
    width: 680,
    height: 480,
    parentId: 'aws-account',
    properties: {
      'CIDR': '10.0.0.0/16',
      'Region': 'us-east-1',
      'Tenancy': 'Default'
    }
  },
  {
    id: 'igw',
    type: 'igw',
    label: 'Internet Gateway',
    x: 430,
    y: 280,
    width: 80,
    height: 80,
    parentId: 'vpc',
    properties: {
      'Gateway ID': 'igw-0ab12cd34',
      'State': 'Attached'
    }
  },

  // Public Subnet
  {
    id: 'subnet-public',
    type: 'subnet-public',
    label: 'Public Subnet',
    x: 540,
    y: 120,
    width: 240,
    height: 400,
    parentId: 'vpc',
    properties: {
      'CIDR': '10.0.1.0/24',
      'Route Table': 'rtb-public',
      'MapPublicIpOnLaunch': 'Enabled'
    }
  },
  {
    id: 'ec2-public',
    type: 'ec2',
    label: 'Web Server (EC2)',
    x: 560,
    y: 160,
    width: 200,
    height: 100,
    parentId: 'subnet-public',
    status: 'running',
    properties: {
      'Instance ID': 'i-0123abcd456',
      'Instance Type': 't3.micro',
      'Public IP': '54.210.32.4',
      'Private IP': '10.0.1.5',
      'Security Group': 'sg-web-access'
    }
  },
  {
    id: 'nat-gateway',
    type: 'nat-gateway',
    label: 'NAT Gateway',
    x: 560,
    y: 360,
    width: 200,
    height: 80,
    parentId: 'subnet-public',
    properties: {
      'NAT ID': 'nat-098765fed',
      'Elastic IP': '54.210.32.99',
      'Private IP': '10.0.1.99'
    }
  },

  // Private Subnet
  {
    id: 'subnet-private',
    type: 'subnet-private',
    label: 'Private Subnet',
    x: 820,
    y: 120,
    width: 240,
    height: 400,
    parentId: 'vpc',
    properties: {
      'CIDR': '10.0.2.0/24',
      'Route Table': 'rtb-private',
      'MapPublicIpOnLaunch': 'Disabled'
    }
  },
  {
    id: 'ec2-private',
    type: 'ec2',
    label: 'DB Server (EC2)',
    x: 840,
    y: 160,
    width: 200,
    height: 100,
    parentId: 'subnet-private',
    status: 'running',
    properties: {
      'Instance ID': 'i-0987dcba654',
      'Instance Type': 't3.small',
      'Private IP': '10.0.2.12',
      'Security Group': 'sg-db-access'
    }
  },

  // S3 Bucket (Outside VPC)
  {
    id: 's3-bucket',
    type: 's3',
    label: 'S3 Bucket (my-app-assets)',
    x: 400,
    y: 600,
    width: 680,
    height: 120,
    parentId: 'aws-account',
    properties: {
      'Bucket Name': 'my-app-assets',
      'Bucket Region': 'us-east-1',
      'Access': 'Bucket Policy Enforced',
      'Encryption': 'SSE-S3 Enabled'
    }
  }
];

export const INITIAL_EDGES: CanvasEdge[] = [
  // User to IGW directly (for use before CloudFront CDN chapter)
  {
    id: 'edge-internet-igw',
    source: 'internet',
    target: 'igw',
    label: 'HTTP (80)',
  },
  // User to CloudFront
  {
    id: 'edge-user-cf',
    source: 'internet',
    target: 'cloudfront',
    label: 'HTTPS (443)',
  },
  // CloudFront to IGW / Web Server
  {
    id: 'edge-cf-igw',
    source: 'cloudfront',
    target: 'igw',
    label: 'Origin Request',
  },
  // IGW to Public EC2
  {
    id: 'edge-igw-ec2',
    source: 'igw',
    target: 'ec2-public',
  },
  // Public EC2 to Private EC2
  {
    id: 'edge-ec2-ec2',
    source: 'ec2-public',
    target: 'ec2-private',
    label: 'SQL (3306)',
  },
  // Private Subnet routing through NAT Gateway for updates
  {
    id: 'edge-ec2-nat',
    source: 'ec2-private',
    target: 'nat-gateway',
    label: 'Outbound TCP',
  },
  {
    id: 'edge-nat-igw',
    source: 'nat-gateway',
    target: 'igw',
  },
  // EC2 Public reading from S3
  {
    id: 'edge-ec2-s3',
    source: 'ec2-public',
    target: 's3-bucket',
    label: 'API (S3 Read)',
  },
  // IAM User bob deploying to S3
  {
    id: 'edge-bob-s3',
    source: 'iam-user',
    target: 's3-bucket',
    label: 'S3 PutObject',
  },
  // IAM Role attached to EC2
  {
    id: 'edge-role-ec2',
    source: 'iam-role',
    target: 'ec2-public',
    label: 'Assumes Role',
    type: 'dashed'
  },
  // IAM Policy attached to Role
  {
    id: 'edge-policy-role',
    source: 'iam-policy',
    target: 'iam-role',
    type: 'dashed'
  },
  // CloudFront caching from S3
  {
    id: 'edge-cf-s3',
    source: 'cloudfront',
    target: 's3-bucket',
    label: 'Static Origin',
  }
];
