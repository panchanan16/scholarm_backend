#!/bin/bash

set -e

echo "🔧 Installing dependencies..."
npm install

echo "🏗️ Building the project..."
npm run build

echo "💾 Start Migrating Databases..."
npm run migrate

echo "🚀 Restarting PM2 process..."
pm2 restart myapp

echo "✅ Deployment script completed!"
