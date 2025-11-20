#!/bin/bash
echo "�� Fixing Ionic UI styling..."

cd /home/lenovo/projects/medisync/medisync-app

echo "1. Updating angular.json for proper CSS..."
cat > angular.json << 'ANGULAR'
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "www",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@ionic/angular/css/core.css",
              "node_modules/@ionic/angular/css/normalize.css",
              "node_modules/@ionic/angular/css/structure.css",
              "node_modules/@ionic/angular/css/typography.css",
              "node_modules/@ionic/angular/css/display.css",
              "node_modules/@ionic/angular/css/padding.css",
              "node_modules/@ionic/angular/css/float-elements.css",
              "node_modules/@ionic/angular/css/text-alignment.css",
              "node_modules/@ionic/angular/css/text-transformation.css",
              "node_modules/@ionic/angular/css/flex-utils.css",
              "src/theme.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            }
          },
          "defaultConfiguration": "production"
        }
      }
    }
  }
}
ANGULAR

echo "2. Updating theme.scss..."
cat > src/theme.scss << 'THEME'
/* Ionic Variables and Theming */
@import "~@ionic/angular/css/core.css";
@import "~@ionic/angular/css/normalize.css";
@import "~@ionic/angular/css/structure.css";
@import "~@ionic/angular/css/typography.css";

/* Optional CSS utils */
@import "~@ionic/angular/css/padding.css";
@import "~@ionic/angular/css/float-elements.css";
@import "~@ionic/angular/css/text-alignment.css";
@import "~@ionic/angular/css/text-transformation.css";
@import "~@ionic/angular/css/flex-utils.css";

:root {
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;
}

body {
  font-family: var(--ion-font-family);
}
THEME

echo "3. Rebuilding..."
rm -rf www/
npm run build

echo "4. Checking CSS files..."
echo "CSS in index.html:"
grep -i "css" www/index.html

echo "5. Deploying..."
firebase deploy

echo ""
echo "✅ UI styling fixed! Your app should now look like ionic serve."
echo "🌐 Check: https://medisync-app-ravi.web.app"
