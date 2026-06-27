import { Chapter } from '@/types';

// Cumulative nodes from IAM that should remain active but dimmed
const IAM_NODES = ['iam-box', 'iam-user', 'iam-role', 'iam-policy'];
const S3_NODES = ['s3-bucket'];

export const vpcChapter: Chapter = {
  id: 'vpc',
  title: 'Virtual Private Cloud',
  shortTitle: 'VPC',
  description: 'Provision logically isolated networks for your resources with custom IP addresses, subnets, and routing.',
  estimatedMinutes: 10,
  steps: [
    {
      id: 'vpc-intro',
      title: 'What is a VPC?',
      text: `
        <p>A <strong>Virtual Private Cloud (VPC)</strong> is your private virtual network inside AWS. It is logically isolated from other networks on the AWS cloud hardware.</p>
        <p>When you create a VPC, you must define an IP address range using <strong>CIDR block notation</strong> (Classless Inter-Domain Routing). For example, <code>10.0.0.0/16</code> provides 65,536 private IP addresses.</p>
        <p>Resources inside this boundary can communicate with each other using private IPs by default, but have no access to or from the public internet.</p>
      `,
      activeNodes: ['aws-account', 'vpc', ...IAM_NODES, ...S3_NODES],
      highlightNodes: ['vpc'],
      camera: { x: 740, y: 320, zoom: 0.75 }
    },
    {
      id: 'vpc-subnets',
      title: 'Subnets (Public vs Private)',
      text: `
        <p>To organize resources, we partition our VPC CIDR range into smaller chunks called <strong>Subnets</strong>. Subnets exist within a single Availability Zone (AZ).</p>
        <p>We configure two subnets in our diagram:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs">
          <li><strong>Public Subnet:</strong> Hosts resources that need directly accessible public IPs, like web servers or load balancers.</li>
          <li><strong>Private Subnet:</strong> Hosts backends, databases, or queue systems that must be protected from external entry.</li>
        </ul>
        <p>The subnets have CIDR ranges carved out from the VPC's main pool.</p>
      `,
      activeNodes: ['aws-account', 'vpc', 'subnet-public', 'subnet-private', ...IAM_NODES, ...S3_NODES],
      highlightNodes: ['subnet-public', 'subnet-private'],
      camera: { x: 800, y: 320, zoom: 1.0 }
    },
    {
      id: 'vpc-igw',
      title: 'Internet Gateway (IGW)',
      text: `
        <p>By default, even the public subnet cannot connect to the internet. To enable external internet traffic, we must attach an <strong>Internet Gateway (IGW)</strong> to the VPC.</p>
        <p>An IGW is a highly available AWS-managed VPC component that performs <strong>static 1:1 NAT translations</strong> between private subnet resource IPs and their assigned public IPs.</p>
        <p>However, attaching the IGW is not enough. We must update the subnets' routing rules to leverage it.</p>
      `,
      activeNodes: ['aws-account', 'vpc', 'igw', 'subnet-public', 'subnet-private', ...IAM_NODES, ...S3_NODES],
      highlightNodes: ['igw'],
      camera: { x: 470, y: 320, zoom: 1.5 }
    },
    {
      id: 'vpc-routing',
      title: 'Route Tables',
      text: `
        <p>VPCs use <strong>Route Tables</strong> to determine where network traffic is directed. Every subnet must be associated with a route table.</p>
        <p>Let's configure the Route Tables:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs font-sans">
          <li><strong>Local Route:</strong> Every route table contains a default rule matching the VPC CIDR (e.g. <code>10.0.0.0/16 -> local</code>) allowing subnets to talk to one another.</li>
          <li><strong>Public Route:</strong> We add a rule to the public subnet route table: <code>0.0.0.0/0 -> igw-xxxx</code>. This tells the subnet to forward all outbound internet requests to the IGW.</li>
        </ul>
      `,
      activeNodes: ['aws-account', 'vpc', 'igw', 'subnet-public', 'subnet-private', ...IAM_NODES, ...S3_NODES],
      highlightNodes: ['igw', 'subnet-public'],
      camera: { x: 565, y: 320, zoom: 1.25 }
    },
    {
      id: 'vpc-nat-gateway',
      title: 'NAT Gateway (Network Address Translation)',
      text: `
        <p>What if resources in the <strong>Private Subnet</strong> need to download operating system updates or package dependencies from the internet?</p>
        <p>They cannot use the IGW because they have no public IPs and we don't want them exposed to inbound connections.</p>
        <p>Instead, we deploy a <strong>NAT Gateway</strong> in the <em>Public Subnet</em>. The NAT Gateway has a public Elastic IP. Private resources route internet traffic to the NAT Gateway, which translates the request, fetches the data from the internet via the IGW, and replies back. The traffic flows <strong>outbound-only</strong>.</p>
      `,
      activeNodes: ['aws-account', 'vpc', 'igw', 'subnet-public', 'nat-gateway', 'subnet-private', ...IAM_NODES, ...S3_NODES],
      highlightNodes: ['nat-gateway'],
      camera: { x: 660, y: 400, zoom: 1.35 }
    }
  ]
};
