import { Chapter } from '@/types';

// Cumulative nodes from all previous chapters
const IAM_NODES = ['iam-box', 'iam-user', 'iam-role', 'iam-policy'];
const S3_NODES = ['s3-bucket'];
const VPC_NODES = ['vpc', 'igw', 'subnet-public', 'subnet-private', 'nat-gateway'];
const EC2_NODES = ['ec2-public', 'ec2-private', 'internet'];

export const cloudfrontChapter: Chapter = {
  id: 'cloudfront',
  title: 'Content Delivery Network',
  shortTitle: 'CloudFront',
  description: 'Deliver data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.',
  estimatedMinutes: 10,
  steps: [
    {
      id: 'cf-intro',
      title: 'What is a CDN?',
      text: `
        <p>When users around the world access our application, they might experience high latency if our servers and S3 buckets are located in a single region (e.g. <code>us-east-1</code> in Virginia).</p>
        <p><strong>Amazon CloudFront</strong> is a <strong>Content Delivery Network (CDN)</strong> that speeds up distribution by caching files at a global network of 450+ <strong>Edge Locations</strong>.</p>
        <p>When a user requests content, they are routed to the nearest Edge Location, minimizing network latency.</p>
      `,
      activeNodes: ['cloudfront', 'aws-account', ...IAM_NODES, ...S3_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-user-cf'],
      highlightNodes: ['cloudfront', 'internet'],
      highlightEdges: ['edge-user-cf'],
      camera: { x: -180, y: 260, zoom: 1.1 }
    },
    {
      id: 'cf-origins',
      title: 'Origins & Cache Hits/Misses',
      text: `
        <p>CloudFront fetches content from one or more <strong>Origins</strong>. An origin is the source of truth for your files. In our setup, we configure two origins:</p>
        <ol class="list-decimal pl-5 my-2 space-y-1 text-xs">
          <li><strong>S3 Bucket Origin:</strong> For static assets like images, stylesheets, and frontend Javascript files.</li>
          <li><strong>EC2 Web Server Origin:</strong> For dynamic API requests.</li>
        </ol>
        <p>When a request hits CloudFront:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs">
          <li><strong>Cache Hit:</strong> If the Edge Location already has a copy of the static asset (within its TTL / Time to Live), it serves it immediately.</li>
          <li><strong>Cache Miss:</strong> If not, CloudFront fetches the asset from the S3 origin, serves it, and caches it locally for future users.</li>
        </ul>
      `,
      activeNodes: ['cloudfront', 'aws-account', ...IAM_NODES, ...S3_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-user-cf', 'edge-cf-s3', 'edge-cf-igw', 'edge-igw-ec2'],
      highlightNodes: ['cloudfront', 's3-bucket', 'ec2-public'],
      highlightEdges: ['edge-cf-s3', 'edge-cf-igw'],
      camera: { x: 440, y: 380, zoom: 0.65 }
    },
    {
      id: 'cf-routing',
      title: 'The Full Architectural Flow',
      text: `
        <p>Now we see the complete architecture in action. Let's trace a user request:</p>
        <p>1. The user requests <code>https://my-app.com/index.html</code>. The DNS resolves to the closest CloudFront Edge Location. CloudFront has this file cached, returning it in milliseconds.</p>
        <p>2. The user submits a dynamic checkout form. This goes to CloudFront, which recognizes it as a dynamic path (e.g. <code>/api/*</code>). It proxies this request straight to the <strong>Internet Gateway</strong>, which routes it to the <strong>Web Server (EC2)</strong>.</p>
        <p>3. The Web Server queries the <strong>Database Server (EC2)</strong> in the private subnet and replies back with JSON, completing the loop securely and quickly.</p>
      `,
      activeNodes: ['cloudfront', 'aws-account', ...IAM_NODES, ...S3_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-user-cf', 'edge-cf-s3', 'edge-cf-igw', 'edge-igw-ec2', 'edge-ec2-ec2', 'edge-ec2-s3', 'edge-role-ec2', 'edge-policy-role'],
      highlightNodes: ['internet', 'cloudfront', 'ec2-public', 'ec2-private', 's3-bucket'],
      highlightEdges: ['edge-user-cf', 'edge-cf-s3', 'edge-cf-igw', 'edge-ec2-ec2'],
      camera: { x: 350, y: 340, zoom: 0.6 }
    }
  ]
};
