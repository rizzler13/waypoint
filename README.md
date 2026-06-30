# Waypoint — Interactive Cloud Infrastructure Learning

> **Waypoint is an interactive cloud architecture simulator designed to teach modern cloud infrastructure step-by-step.**
>
> 🔗 **[Explore Waypoint Live Simulator](https://d30924xgb9fh2u.cloudfront.net/)**

---

Waypoint replaces static diagrams and dry documentation with an active network canvas. Developers trace request traffic, trigger load distributions, and inspect detailed configuration rules (subnets, routing paths, caching properties, microservice queues, serverless endpoints) in real-time as the topology dynamically adapts.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Canvas Engine**: React Flow & Custom HTML5 Canvas Vector Renderers
- **Styling**: Tailwind CSS & Vanilla CSS
- **Authentication**: Firebase Auth
- **Infrastructure**: AWS S3 & AWS CloudFront CDN

---

## Technical Architecture & Core Systems

### 1. Multi-Track Curriculum Engine
Waypoint organizes cloud education into specialized interactive learning tracks:
*   **Track A: AWS Cloud Infrastructure**: Guides developers through IAM roles, VPC networks, S3/CloudFront CDNs, RDS failovers, database caches (Redis/DynamoDB), and microservices (ECS Fargate/Lambda/SQS/SNS).
*   **Track B: Containers & Kubernetes Orchestration**: Explores namespaces/cgroups, layered Docker filesystems, Pod schedulers, ReplicaSets, rolling updates, and Service routing.
*   **Track C: Cloud Observability**: Teaches logging aggregation, time-series metrics query engines (Prometheus/Grafana), and request span context tracing (OpenTelemetry/Jaeger).
*   **Track D: Maintainability & Operations**: Focuses on Infrastructure as Code (Terraform), CI/CD canary automation, and incident mitigation runbooks.

### 2. State-Driven Network Canvas
The simulator renders custom HTML5 canvas vector icons (cylinders, hexagons, network waves) and dynamically updates active connection paths as learners progress through checkpoints.

### 3. Node Metadata Inspector
Selecting any canvas element slides out a granular inspector displaying simulated JSON configuration payloads, giving developers direct insight into resource properties (e.g. security group rules, load balancer schemes, database subnet definitions).

### 4. Static Export & Deployment Pipeline
Waypoint is statically exported (`output: 'export'`) and deployed to an S3/CloudFront CDN. A custom CloudFront error handler routes S3 404s back to `/index.html` fallback where client-side Next.js normalizes routes (such as `/learn` -> `/learn/index.html`), maintaining clean, clean routing without running a web server.

---

*Built for Learners. Open source with passion ❤️*

