#!/bin/bash
echo "🧹 Final cleanup before deployment..."

cd /home/lenovo/projects/medisync/medisync-app

echo "Deleting Netlify config..."
rm -f netlify.toml

echo "Deleting Angular cache..."
rm -rf .angular/

echo "Cleaning complete! Pushing to GitHub..."
git add .
git commit -m "clean: Remove config and cache files for clean deployment"
git push origin main

echo ""
echo "✅ Cleanup complete!"
echo "🚀 Netlify will now:"
echo "   - Use default build settings"
echo "   - Create fresh Angular cache"
echo "   - Deploy successfully to: https://medisynccc.netlify.app"
