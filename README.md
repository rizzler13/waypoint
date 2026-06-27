# Waypoint — Interactive AWS Architecture Learning

> **Waypoint is an interactive cloud architecture simulator designed to teach AWS infrastructure step-by-step.**
>
> 🔗 **[Explore Waypoint Live Simulator](https://d30924xgb9fh2u.cloudfront.net/)**

---

Waypoint replaces static charts and dry documentation with an active network canvas. Developers trace request traffic, trigger load distributions, and inspect detailed configuration rules (VPC security group boundaries, routing paths, CDN caching properties) in real-time as the topology dynamically adapts.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Canvas Engine**: React Flow (`@xyflow/react`)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth (Google OAuth & Email/Password)
- **Infrastructure**: AWS S3 & AWS CloudFront CDN

---

## Technical Architecture & Core Systems

### 1. Evolving Topology State Engine
The sandbox curriculum dynamically modifies network states through successive checkpoints:
- **IAM**: User permissions, console vs access key delegation.
- **VPC**: Private/public subnets, routing tables, Internet Gateways.
- **EC2**: Compute instances, security groups, public IP routing.
- **S3**: Object assets, public blocks, bucket policies.
- **CloudFront**: Global CDN distributions, edge caches, dynamic invalidations.

Completion of each checkpoint triggers dynamic path-recalculation rules, rendering packet flow simulations along active connection paths in real-time.

### 2. Node Metadata Inspector
Selecting any canvas element slides out a granular inspector displaying simulated AWS configuration payloads, giving developers direct insight into how AWS resources are structured under the hood.

### 3. Serverless S3/CloudFront Pipeline
Waypoint is configured to build entirely as static exports (`output: 'export'`). 
- **Deployment Script**: Utilizes a Node script ([deploy-aws.mjs](file:///Users/rizzler/Desktop/waypoint/scripts/deploy-aws.mjs)) executing against S3 and CloudFront SDK clients to automate file syncs and clear edge-cache targets.
- **Client Routing Handling**: Configured custom CloudFront error responses to redirect S3 access exceptions back to `/index.html` with a 200 OK code, preserving clean client-side dynamic route navigation.

---

## Future Vision & Roadmap

Waypoint is designed as a modular visual sandbox. Our upcoming iterations focus on expanding the platform into a comprehensive cloud design and deployment engine:

- [ ] **Multi-Service Catalog**: Expand from core services to advanced AWS utilities (e.g. RDS, Lambda, API Gateway, DynamoDB, ECS Fargate).
- [ ] **Export to IaC**: Allow developers to design an architecture in the visual simulator and export it directly as fully valid **Terraform** configurations or **AWS CDK** stacks.
- [ ] **Live Account Sync**: Connect AWS read-only credentials to overlay a developer's real, live AWS account topology on the Waypoint interactive canvas.
- [ ] **Multi-Player Collaboration**: Collaborative whiteboard rooms where engineering teams can map, simulate, and comment on system architectures together in real-time.

---
*Built for developers. Open source.*
