#!/bin/bash
echo "🎯 Final fix for Netlify deployment..."

cd /home/lenovo/projects/medisync/medisync-app

# Create correct netlify.toml
cat > netlify.toml << 'TOML'
[build]
  command = "npm run build"
  publish = "www"
  base = "."

[build.environment]
  NODE_VERSION = "20.19.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
TOML

echo "✅ Created correct netlify.toml"

# Verify our configuration files
echo ""
echo "📋 Current configuration files:"
ls -la | grep -E '(netlify|nvmrc|npmrc)'

echo ""
echo "📁 Project structure:"
ls -la

echo ""
echo "📤 Pushing to GitHub..."
git add netlify.toml
git commit -m "fix: Correct netlify.toml configuration with base directory"
git push origin main

echo ""
echo "🚀 Fix deployed!"
echo "🌐 Your app should now build successfully at: https://medisynccc.netlify.app"
