import { Chapter } from '@/types';

// Cumulative nodes from previous chapters
const IAM_NODES = ['iam-box', 'iam-user', 'iam-role', 'iam-policy'];
const S3_NODES = ['s3-bucket'];
const VPC_NODES = ['vpc', 'igw', 'subnet-public', 'subnet-private', 'nat-gateway'];

export const ec2Chapter: Chapter = {
  id: 'ec2',
  title: 'Elastic Compute Cloud',
  shortTitle: 'EC2',
  description: 'Deploy virtual servers (instances) in the cloud with resizable compute capacity and customizable security access.',
  estimatedMinutes: 9,
  steps: [
    {
      id: 'ec2-intro',
      title: 'What is EC2?',
      text: `
        <p><strong>Elastic Compute Cloud (EC2)</strong> is the service that lets you deploy virtual machines (called <strong>Instances</strong>) inside AWS.</p>
        <p>When launching an instance, you configure:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs">
          <li><strong>AMI (Amazon Machine Image):</strong> A template specifying the OS, packages, and storage layout (e.g., Ubuntu, Amazon Linux 2023).</li>
          <li><strong>Instance Type:</strong> The size of CPU, RAM, and network capabilities (e.g., <code>t3.micro</code>, <code>c6i.large</code>).</li>
          <li><strong>EBS Volume:</strong> Persistent block storage virtual disks (like SSDs) attached to the instance.</li>
        </ul>
      `,
      activeNodes: ['aws-account', 'ec2-public', 'ec2-private', ...IAM_NODES, ...S3_NODES, ...VPC_NODES],
      highlightNodes: ['ec2-public', 'ec2-private'],
      camera: { x: 800, y: 210, zoom: 1.0 }
    },
    {
      id: 'ec2-public-server',
      title: 'Running a Web Server',
      text: `
        <p>We deploy our <code>Web Server (EC2)</code> in the <strong>Public Subnet</strong>. AWS assigns it a private IP (<code>10.0.1.5</code>) and a public IP (<code>54.210.32.4</code>).</p>
        <p>An internet client sends requests to the public IP. The Internet Gateway translates and routes this to the private IP of the server.</p>
        <p>The instance handles incoming HTTP/HTTPS requests, serving dynamic HTML or APIs.</p>
      `,
      activeNodes: ['internet', 'aws-account', 'ec2-public', 'ec2-private', 'edge-internet-igw', 'edge-igw-ec2', ...IAM_NODES, ...S3_NODES, ...VPC_NODES],
      highlightNodes: ['ec2-public', 'internet'],
      highlightEdges: ['edge-internet-igw', 'edge-igw-ec2'],
      camera: { x: 150, y: 260, zoom: 0.7 }
    },
    {
      id: 'ec2-security-groups',
      title: 'Security Groups (Stateful Firewalls)',
      text: `
        <p>How do we protect our EC2 instances? We wrap them in a <strong>Security Group</strong>. A Security Group acts as a <strong>stateful virtual firewall</strong> controlling traffic at the instance level.</p>
        <p><strong>Rules:</strong> You define allowed ports, protocols, and sources. For our web server, we add a rule: <code>Allow TCP 80/443 from 0.0.0.0/0</code>.</p>
        <p><strong>Stateful Evaluator:</strong> Security groups are <em>stateful</em>. If an inbound request is allowed, the response traffic is automatically allowed to leave, regardless of outbound rules.</p>
        <div class="my-2 p-2 bg-amber-50 border-l-4 border-amber-500 rounded text-[10px] text-amber-900 font-sans">
          <strong>Compare:</strong> Network Access Control Lists (NACLs) operate at the <em>subnet</em> level and are <em>stateless</em> (meaning you must explicitly configure both inbound and outbound traffic rules).
        </div>
      `,
      activeNodes: ['internet', 'aws-account', 'ec2-public', 'ec2-private', 'edge-internet-igw', 'edge-igw-ec2', ...IAM_NODES, ...S3_NODES, ...VPC_NODES],
      highlightNodes: ['ec2-public'],
      camera: { x: 660, y: 210, zoom: 1.5 }
    },
    {
      id: 'ec2-private-db',
      title: 'Multi-Tier Internal Routing',
      text: `
        <p>For security, we place our <code>DB Server (EC2)</code> in the <strong>Private Subnet</strong>. It does not have a public IP, so it is inaccessible from the internet.</p>
        <p>To let the Web Server query the Database, we open port <code>3306</code> (MySQL) in the DB's Security Group, but specify the source as the Web Server's Security Group ID (<code>sg-web-access</code>), rather than a wide IP range.</p>
        <p>This ensures only our Web Server can talk to the Database server.</p>
      `,
      activeNodes: ['internet', 'aws-account', 'ec2-public', 'ec2-private', 'edge-internet-igw', 'edge-igw-ec2', 'edge-ec2-ec2', ...IAM_NODES, ...S3_NODES, ...VPC_NODES],
      highlightNodes: ['ec2-public', 'ec2-private'],
      highlightEdges: ['edge-ec2-ec2'],
      camera: { x: 800, y: 210, zoom: 1.1 }
    }
  ]
};
