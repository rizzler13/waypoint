import { Chapter } from '@/types';

// Cumulative nodes from previous chapters
const IAM_NODES = ['iam-box', 'iam-user', 'iam-role', 'iam-policy'];
const VPC_NODES = ['vpc', 'igw', 'subnet-public', 'subnet-private', 'nat-gateway'];
const EC2_NODES = ['ec2-public', 'ec2-private', 'internet'];

export const s3Chapter: Chapter = {
  id: 's3',
  title: 'Simple Storage Service',
  shortTitle: 'S3',
  description: 'Store and retrieve any amount of data from anywhere with industry-leading durability, availability, and security.',
  estimatedMinutes: 9,
  steps: [
    {
      id: 's3-intro',
      title: 'Object Storage vs Block Storage',
      text: `
        <p>Unlike EBS volumes which are block storage virtual hard drives mounted to a single server, <strong>Amazon S3 (Simple Storage Service)</strong> is a global, serverless <strong>Object Storage</strong> service.</p>
        <p>In S3, you store data inside containers called <strong>Buckets</strong>. A bucket contains files (called <strong>Objects</strong>). Objects are stored in a flat namespace using <strong>Keys</strong> (e.g. <code>images/logo.png</code>). There are no real folders — prefixes are just part of the object's string key.</p>
        <p>S3 is designed for <strong>99.999999999% (11 9s) of durability</strong>, copying your files across at least three physical Availability Zones in a region automatically.</p>
      `,
      activeNodes: ['aws-account', 's3-bucket', ...IAM_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-internet-igw', 'edge-igw-ec2', 'edge-ec2-ec2'],
      highlightNodes: ['s3-bucket'],
      camera: { x: 740, y: 660, zoom: 1.2 }
    },
    {
      id: 's3-credentials',
      title: 'Accessing S3 from EC2 (Role Assumption)',
      text: `
        <p>Recall from Chapter 1 (IAM) that we created the <code>EC2-S3-Read-Role</code>. Now, let's attach this role to our Web Server instance using an <strong>Instance Profile</strong>.</p>
        <p>When our web server runs code using the AWS SDK (e.g. <code>aws s3 cp</code>), the SDK makes a request to the local link-local address <code>http://169.254.169.254</code> (the <strong>Instance Metadata Service / IMDS</strong>).</p>
        <p>IMDS returns temporary security credentials for the attached role. The SDK automatically signs the API request to S3 using these dynamic keys. No static passwords or keys are saved on the server!</p>
      `,
      activeNodes: ['aws-account', 's3-bucket', ...IAM_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-internet-igw', 'edge-igw-ec2', 'edge-ec2-ec2', 'edge-role-ec2', 'edge-ec2-s3', 'edge-policy-role'],
      highlightNodes: ['iam-role', 'ec2-public', 's3-bucket'],
      highlightEdges: ['edge-role-ec2', 'edge-ec2-s3'],
      camera: { x: 500, y: 400, zoom: 0.72 }
    },
    {
      id: 's3-bucket-policies',
      title: 'S3 Bucket Policies',
      text: `
        <p>To control who can read or write to our bucket, we can configure an <strong>S3 Bucket Policy</strong>. Unlike IAM Policies which are attached to users or roles (identity-based), a Bucket Policy is attached directly to the bucket resource (resource-based).</p>
        <p>For example, if we want to allow any public user to view images in our bucket, we can add a public read bucket policy. However, AWS enables <strong>Block Public Access (BPA)</strong> by default to prevent accidental data leaks.</p>
        <p>Our bucket remains private, allowing only authorized identities (like our EC2 server with its IAM role) to read objects.</p>
      `,
      activeNodes: ['aws-account', 's3-bucket', ...IAM_NODES, ...VPC_NODES, ...EC2_NODES],
      activeEdges: ['edge-internet-igw', 'edge-igw-ec2', 'edge-ec2-ec2', 'edge-ec2-s3'],
      highlightNodes: ['s3-bucket'],
      camera: { x: 740, y: 660, zoom: 1.2 }
    }
  ]
};
