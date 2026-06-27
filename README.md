# Waypoint — Interactive AWS Architecture Learning

Waypoint is an interactive cloud architecture simulator designed to teach AWS infrastructure step-by-step. Instead of reading dry blog posts or inspecting static charts, developers trace simulated request traffic, toggle resources, and inspect configuration parameters (security rules, routing tables, CDN cache policies) in real-time as the topology live-evolves.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Canvas & Simulation**: React Flow (`@xyflow/react`)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth (Google OAuth & Email/Password) with dynamic local-sim fallback
- **Hosting**: AWS S3 (Static Website hosting) & AWS CloudFront (CDN)

---

## Features & Technical Implementation

### 1. Evolving Topology State Engine
The learning curriculum is divided into progressive architectural stages:
- **IAM**: User permissions, console vs access key delegation.
- **VPC**: Private/public subnets, route tables, Internet Gateways.
- **EC2**: Compute instances, security groups, public IP routing.
- **S3**: Blob assets, public blocks, bucket policies.
- **CloudFront**: Global CDN distributions, edge caches, dynamic invalidations.

As students complete chapters, the canvas recalculates routes and triggers packet flow animations showing network traffic moving along active connection vectors.

### 2. Node Config & Metadata Inspector
Selecting any canvas node slides out a real-time configuration inspector window detailing the underlying properties of the AWS resource (e.g. security group rule arrays, bucket access lists, CDN cache rules).

### 3. Serverless Deployment & Pipeline
Because the entire simulator runs as client-side React Flow nodes, Next.js compiles down to static HTML exports.
- **AWS Deploy Pipeline**: Includes a custom lightweight Node script (`scripts/deploy-aws.mjs`) utilizing the `@aws-sdk/client-s3` and `@aws-sdk/client-cloudfront` APIs.
- Uploads assets to S3 and automatically provisions invalidations on CloudFront edge locations, bypassing macOS Python environment configuration conflicts.

---

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

### Environment Settings
Copy `.env.local.example` to `.env` or `.env.local`:
```bash
# Firebase Client config
NEXT_PUBLIC_FIREBASE_API_KEY=...
# AWS Deployment config (Local Node build use only)
AWS_ACCESS_KEY_ID=...
AWS_S3_BUCKET=...
```
*Note: If no Firebase credentials are found, the app automatically switches to secure local demo fallback mode.*

### Deploying to AWS S3 & CloudFront
To build the static files, sync them to your S3 bucket, and invalidate CloudFront caches:
```bash
npm run build
npm run deploy
```

---

## Future Vision & Roadmap

Waypoint is designed as a modular visual sandbox. Our upcoming iterations focus on expanding the platform into a comprehensive cloud design and deployment engine:

- [ ] **Multi-Service Catalog**: Expand from core services to advanced AWS utilities (e.g. RDS, Lambda, API Gateway, DynamoDB, ECS Fargate).
- [ ] **Export to IaC**: Allow developers to design an architecture in the visual simulator and export it directly as fully valid **Terraform** configurations or **AWS CDK** stacks.
- [ ] **Live Account Sync**: Connect AWS read-only credentials to overlay a developer's real, live AWS account topology on the Waypoint interactive canvas.
- [ ] **Multi-Player Collaboration**: Collaborative whiteboard rooms where engineering teams can map, simulate, and comment on system architectures together in real-time.

---
*Built for developers. Open source.*
