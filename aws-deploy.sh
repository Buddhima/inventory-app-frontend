#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Build the Ionic project
echo "Building Ionic project..."
ionic build

# 2. Sync the build folder to S3
echo "Uploading to S3..."
aws s3 sync build/ s3://buddhima-inventory-app-web --delete

echo "Deployment complete!"
