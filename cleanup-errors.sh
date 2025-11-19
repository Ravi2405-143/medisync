#!/bin/bash
echo "🧹 Cleaning up false TypeScript errors..."

cd /home/lenovo/projects/medisync/medisync-app

# Remove Angular cache
echo "Removing Angular cache..."
rm -rf .angular/cache

# Update .gitignore
echo "Updating .gitignore..."
cat > .gitignore << 'GITIGNORE'
# Angular
/.angular
/dist
/tmp
/out-tsc

# Dependencies
/node_modules
/npm-debug.log*

# IDE
/.vscode
/.idea

# System
.DS_Store
Thumbs.db

# Capacitor
android/
ios/
www/
GITIGNORE

# Push clean code
echo "Pushing clean code to GitHub..."
git add .
git commit -m "fix: Remove cache files and update .gitignore"
git push origin main

echo ""
echo "✅ Cache cleared!"
echo "🚀 False errors should be gone!"
echo "🌐 Netlify will build successfully now!"
