import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import mime from 'mime-types';

// Load local environment secrets if .env.local exists
if (existsSync('.env.local')) {
  const envFile = readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) {
          process.env[key] = value;
        }
      }
    }
  });
}

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION = 'us-east-1',
  AWS_S3_BUCKET,
  AWS_CLOUDFRONT_DISTRIBUTION_ID
} = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
  console.error('\x1b[31mError: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET must be set in .env.local\x1b[0m');
  process.exit(1);
}

// Initialize Clients
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

const cloudfront = new CloudFrontClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

const OUT_DIR = join(process.cwd(), 'out');

if (!existsSync(OUT_DIR)) {
  console.error('\x1b[31mError: Build directory "out/" does not exist. Run "npm run build" first.\x1b[0m');
  process.exit(1);
}

// Get all files recursively
function getFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function deploy() {
  console.log('\x1b[36mStarting Waypoint AWS Static Site Deployment...\x1b[0m');
  const files = getFiles(OUT_DIR);
  console.log(`Found ${files.length} static assets in "out/" directory.`);

  for (const file of files) {
    const relativePath = relative(OUT_DIR, file);
    const key = relativePath.replace(/\\/g, '/'); // Normalize paths for S3
    const fileContent = readFileSync(file);
    const contentType = mime.lookup(file) || 'application/octet-stream';

    console.log(`Uploading: ${key} (${contentType})`);

    await s3.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: key,
        Body: fileContent,
        ContentType: contentType
      })
    );
  }
  console.log('\x1b[32m✔ S3 Upload completed successfully.\x1b[0m');

  if (AWS_CLOUDFRONT_DISTRIBUTION_ID) {
    console.log('\x1b[34mTriggering CloudFront Invalidation for CDN cache clear...\x1b[0m');
    const invalidation = await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: AWS_CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `waypoint-deploy-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ['/*']
          }
        }
      })
    );
    console.log(`\x1b[32m✔ Invalidation created successfully (ID: ${invalidation.Invalidation.Id})\x1b[0m`);
  } else {
    console.log('\x1b[33mNo CloudFront Distribution ID configured. Skipping cache invalidation.\x1b[0m');
  }

  console.log('\x1b[32;1mWaypoint deployment completed successfully!\x1b[0m');
}

deploy().catch((err) => {
  console.error('\x1b[31mDeployment failed with error:\x1b[0m', err);
  process.exit(1);
});
