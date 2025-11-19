cat > src/app/services/auth.service.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'medisync_token';
  private userKey = 'medisync_user';
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Register new user
  async register(userData: any): Promise<boolean> {
    try {
      const response = await this.apiService.register(userData).toPromise();
      if (response) {
        this.setSession(response);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.error?.message || 'Registration failed');
    }
  }

  // Login user
  async login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const response = await this.apiService.login(credentials).toPromise();
      if (response) {
        this.setSession(response);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.error?.message || 'Login failed');
    }
  }

  // Set session after login/register
  private setSession(authResult: any) {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get current user
  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
EOF