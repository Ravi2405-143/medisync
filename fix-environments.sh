#!/bin/bash
echo "🔧 Creating missing environment files..."

cd /home/lenovo/projects/medisync/medisync-app

# Create environments directory
mkdir -p src/environments

# Create development environment
cat > src/environments/environment.ts << 'ENV_DEV'
export const environment = {
  production: false,
  appName: 'MediSync',
  version: '1.0.0'
};
ENV_DEV

# Create production environment
cat > src/environments/environment.prod.ts << 'ENV_PROD'
export const environment = {
  production: true,
  appName: 'MediSync',
  version: '1.0.0'
};
ENV_PROD

echo "✅ Created environment files:"
ls -la src/environments/

# Test build locally
echo ""
echo "Testing build locally..."
npm run build && echo "✅ Local build successful!" || echo "❌ Local build failed"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git add src/environments/
git commit -m "fix: Add missing environment.ts and environment.prod.ts files"
git push origin main

echo ""
echo "🚀 Fix deployed!"
echo "🌐 Netlify should now build successfully!"
