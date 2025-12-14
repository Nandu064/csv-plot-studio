#!/bin/bash

# CSV Plot Studio - Netlify Deployment Script
# This script will deploy your site to Netlify

echo "🚀 CSV Plot Studio - Netlify Deployment"
echo "========================================"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "⚠️  Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Check if already logged in
if ! netlify status &> /dev/null
then
    echo "🔐 Please log in to Netlify..."
    netlify login
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy
    echo "📦 Deploying to Netlify..."
    echo ""
    echo "Choose deployment type:"
    echo "1. Draft deploy (test first)"
    echo "2. Production deploy"
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" == "1" ]; then
        netlify deploy
    else
        netlify deploy --prod
    fi
    
    echo ""
    echo "🎉 Deployment complete!"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
