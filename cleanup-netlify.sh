#!/bin/bash
echo "🧹 Cleaning up Netlify configuration..."

cd /home/lenovo/projects/medisync/medisync-app

# Remove problematic config files
echo "Removing netlify.toml and other config issues..."
rm -f netlify.toml
find . -name ".netlify" -type d -exec rm -rf {} + 2>/dev/null || true

# Keep the good files we created
echo "Keeping: .nvmrc, .npmrc, package.json"

# Verify current structure
echo ""
echo "📁 Current project structure:"
ls -la

echo ""
echo "✅ Cleanup complete!"
echo "📤 Pushing to GitHub..."

git add -A
git commit -m "fix: Remove problematic Netlify config files"
git push origin main

echo ""
echo "🚀 Changes pushed!"
echo "🌐 Netlify should now deploy successfully to: https://medisynccc.netlify.app"
