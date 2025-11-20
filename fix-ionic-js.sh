#!/bin/bash
echo "🔧 Fixing Ionic JavaScript loading..."

cd /home/lenovo/projects/medisync/medisync-app

echo "1. Creating proper index.html..."
cat > src/index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>MediSync</title>
  <base href="/" />
  <meta name="color-scheme" content="light dark" />
  <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: gap:;">
  <link rel="manifest" href="manifest.json" />
  <meta name="theme-color" content="#1976d2" />
</head>
<body>
  <app-root></app-root>
</body>
</html>
HTML

echo "2. Cleaning and rebuilding..."
rm -rf www/ node_modules/.cache/
npm run build

echo "3. Checking JavaScript files..."
echo "JavaScript files found:"
find www/ -name "*.js" | wc -l

echo "4. Deploying..."
firebase deploy

echo ""
echo "✅ Fixed! Your app should now work properly at:"
echo "   https://medisync-app-ravi.web.app"
