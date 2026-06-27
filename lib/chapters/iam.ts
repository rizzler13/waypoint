import { Chapter } from '@/types';

export const iamChapter: Chapter = {
  id: 'iam',
  title: 'Identity & Access Management',
  shortTitle: 'IAM',
  description: 'Control authentication and authorization for all AWS resources using users, groups, policies, and roles.',
  estimatedMinutes: 8,
  steps: [
    {
      id: 'iam-intro',
      title: 'Introduction to IAM',
      text: `
        <p>Before you can interact with any service in AWS, you must establish <strong>identity</strong> and <strong>authorization</strong>. AWS <em>Identity & Access Management (IAM)</em> is the foundational gatekeeper of your AWS account.</p>
        <p>By default, the master account user (Root User) has absolute access, which is a major security risk for daily operations. Instead, we use IAM to create granular identities.</p>
        <div class="my-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-900 font-sans">
          <strong>Best Practice:</strong> Lock away root credentials immediately, enable MFA, and create dedicated IAM Users or roles for administrative tasks.
        </div>
      `,
      activeNodes: ['aws-account', 'iam-box'],
      highlightNodes: ['iam-box'],
      camera: { x: 240, y: 320, zoom: 1.2 }
    },
    {
      id: 'iam-users',
      title: 'IAM Users & Credentials',
      text: `
        <p>Let's create an <strong>IAM User</strong> named <em>Bob</em>. An IAM User represents an individual or application that interacts directly with AWS.</p>
        <p>Bob can be assigned two types of credentials:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs">
          <li><strong>Console Password:</strong> To sign in to the web-based AWS Management Console.</li>
          <li><strong>Access Keys (Access Key ID & Secret Access Key):</strong> To sign in via the AWS CLI or SDK.</li>
        </ul>
        <p>Currently, Bob is completely empty. He has no permissions associated with his user card.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user'],
      highlightNodes: ['iam-user'],
      camera: { x: 240, y: 200, zoom: 1.5 }
    },
    {
      id: 'iam-default-deny',
      title: 'The Evaluation Logic: Default Deny',
      text: `
        <p>Suppose we create an <strong>S3 Bucket</strong> (a container for files) called <code>my-app-assets</code>.</p>
        <p>If Bob tries to access or upload files to this bucket, the request will immediately fail with an <code>AccessDenied</code> error.</p>
        <p><strong>Evaluation Rule:</strong> In AWS, all requests are <strong>implicitly denied</strong> by default. A request is only allowed if an explicit policy statement grants permission. If any policy contains an explicit <em>Deny</em>, it overrides any <em>Allows</em>.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user', 's3-bucket', 'edge-bob-s3'],
      highlightNodes: ['iam-user', 's3-bucket'],
      highlightEdges: ['edge-bob-s3'],
      camera: { x: 460, y: 430, zoom: 0.72 }
    },
    {
      id: 'iam-policies',
      title: 'IAM Policies (JSON Documents)',
      text: `
        <p>To grant Bob access, we must write an <strong>IAM Policy</strong>. A policy is a JSON document that defines formal permissions.</p>
        <p>A policy document consists of one or more statements containing:</p>
        <ul class="list-disc pl-5 my-2 space-y-1 text-xs font-sans">
          <li><strong>Effect:</strong> <code>Allow</code> or <code>Deny</code></li>
          <li><strong>Action:</strong> The API operations to match (e.g., <code>s3:GetObject</code>)</li>
          <li><strong>Resource:</strong> The ARN (Amazon Resource Name) identifying the target resources.</li>
        </ul>
        <p>Let's create the <code>S3-ReadOnly-Policy</code> containing permissions to retrieve bucket objects.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user', 'iam-policy', 's3-bucket'],
      highlightNodes: ['iam-policy'],
      camera: { x: 240, y: 440, zoom: 1.5 }
    },
    {
      id: 'iam-user-policies',
      title: 'Attaching Policies vs IAM Groups',
      text: `
        <p>We can attach policies directly to Bob. However, managing policies per user is an administrative nightmare as teams grow.</p>
        <p>Instead, the best practice is to use <strong>IAM Groups</strong> (like <em>Developers</em> or <em>Admins</em>). You attach policies to the Group, and users inherit permissions by joining the group.</p>
        <p>Bob inherits S3 read access through his group membership, enabling him to query <code>my-app-assets</code> bucket data.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user', 'iam-policy', 's3-bucket', 'edge-bob-s3'],
      highlightNodes: ['iam-user', 'iam-policy'],
      highlightEdges: ['edge-bob-s3'],
      camera: { x: 460, y: 430, zoom: 0.72 }
    },
    {
      id: 'iam-roles',
      title: 'IAM Roles (Temporary Credentials)',
      text: `
        <p>What if we have an <strong>EC2 Server</strong> that needs to read assets from our S3 bucket? Should we store Bob's Access Keys inside the code on the server?</p>
        <div class="p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-900 font-sans my-2">
          <strong>Security Warning:</strong> Hardcoding access keys inside application servers is a massive risk. If the server is compromised, those credentials are leaked. Keys are static and never expire automatically.
        </div>
        <p>Instead, we use <strong>IAM Roles</strong>. A Role is an identity that does not have credentials (passwords or keys) associated with it. Instead, it is <em>assumed</em> by entities dynamically, yielding <strong>short-lived credentials</strong> (valid for hours) that rotate automatically.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user', 'iam-role', 'iam-policy', 's3-bucket'],
      highlightNodes: ['iam-role'],
      camera: { x: 240, y: 320, zoom: 1.5 }
    },
    {
      id: 'iam-role-trust',
      title: 'Trust Policies & EC2 Profile',
      text: `
        <p>To let our EC2 server assume a role, we create <code>EC2-S3-Read-Role</code>. It has two policies:</p>
        <ol class="list-decimal pl-5 my-2 space-y-1 text-xs">
          <li><strong>Permissions Policy:</strong> <code>S3-ReadOnly-Policy</code> specifying what S3 actions are allowed.</li>
          <li><strong>Trust Policy:</strong> Specifying <em>who</em> is allowed to assume this role (in this case, the EC2 service <code>ec2.amazonaws.com</code>).</li>
        </ol>
        <p>When attached to the EC2 server, AWS uses the <strong>Instance Metadata Service (IMDS)</strong> to inject temporary session tokens into the server, enabling it to read from S3 securely.</p>
      `,
      activeNodes: ['aws-account', 'iam-box', 'iam-user', 'iam-role', 'iam-policy', 's3-bucket', 'edge-policy-role'],
      highlightNodes: ['iam-role', 'iam-policy'],
      highlightEdges: ['edge-policy-role'],
      camera: { x: 240, y: 380, zoom: 1.4 }
    }
  ]
};
