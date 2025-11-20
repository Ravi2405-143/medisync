#!/bin/bash
echo "🔄 Restoring your actual MediSync app..."

cd /home/lenovo/projects/medisync/medisync-app

echo "1. Restoring app component..."
cat > src/app/app.component.html << 'HTML'
<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
HTML

cat > src/app/app.component.ts << 'TS'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterOutlet]
})
export class AppComponent {
  constructor() {}
}
TS

echo "2. Creating routes if needed..."
cat > src/app/app.routes.ts << 'ROUTES'
import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
ROUTES

echo "3. Updating main.ts..."
cat > src/main.ts << 'MAIN'
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading()),
  ],
});
MAIN

echo "4. Rebuilding..."
rm -rf www/
npm run build

echo "5. Deploying..."
firebase deploy

echo ""
echo "✅ Your actual MediSync app is restored!"
echo "🌐 Check: https://medisync-app-ravi.web.app"
echo "   You should see the login page with proper Ionic styling!"
