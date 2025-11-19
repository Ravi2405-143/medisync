#!/bin/bash
echo "🔧 Applying final fixes..."

cd /home/lenovo/projects/medisync/medisync-app

# Update environment files with apiUrl
echo "Updating environment files..."
cat > src/environments/environment.ts << 'ENV_DEV'
export const environment = {
  production: false,
  appName: 'MediSync',
  apiUrl: 'http://localhost:3000',
  version: '1.0.0'
};
ENV_DEV

cat > src/environments/environment.prod.ts << 'ENV_PROD'
export const environment = {
  production: true,
  appName: 'MediSync',
  apiUrl: 'https://your-api-url.com',
  version: '1.0.0'
};
ENV_PROD

# Clear Angular cache
echo "Clearing Angular cache..."
rm -rf .angular/cache

# Test build
echo "Testing build..."
npm run build && echo "✅ Build successful!" || echo "❌ Build failed"

# Push to GitHub
echo "Pushing to GitHub..."
git add src/environments/
git commit -m "fix: Add apiUrl to environment files and clear cache"
git push origin main

echo ""
echo "🚀 All fixes applied!"
echo "🌐 Netlify should now build successfully!"
echo "📱 Your app will be live at: https://medisynccc.netlify.app"
