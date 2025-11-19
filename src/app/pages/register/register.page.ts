import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterPage {
  
  userData = {
    fullName: '',
    email: '',
    password: ''
  };
  
  isLoading: boolean = false;
  statusMessage: string = 'Fill the form to create account';

  constructor(private router: Router) {}

  // Test function - we know this works
  testClick() {
    console.log('Test button clicked!');
    this.statusMessage = 'Test button worked at: ' + new Date().toLocaleTimeString();
  }

  // Complete registration function
  register() {
    console.log('Starting registration...');
    
    // Validation
    if (!this.userData.fullName || !this.userData.email || !this.userData.password) {
      this.statusMessage = '❌ Please fill all fields';
      alert('Please fill in all fields');
      return;
    }
    
    if (this.userData.password.length < 6) {
      this.statusMessage = '❌ Password must be at least 6 characters';
      alert('Password must be at least 6 characters');
      return;
    }
    
    this.isLoading = true;
    this.statusMessage = '🔄 Creating your account...';
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Get existing users or create empty array
        const existingUsers = JSON.parse(localStorage.getItem('medisync_users') || '[]');
        
        // Check if user already exists
        const userExists = existingUsers.find((user: any) => user.email === this.userData.email);
        if (userExists) {
          this.statusMessage = '❌ User with this email already exists';
          alert('User with this email already exists');
          this.isLoading = false;
          return;
        }
        
        // Create new user
        const newUser = {
          id: 'user_' + Date.now(),
          fullName: this.userData.fullName,
          email: this.userData.email,
          password: this.userData.password,
          createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('medisync_users', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        console.log('User registered successfully:', newUser);
        this.statusMessage = '✅ Account created successfully!';
        
        // Show success and redirect
        alert('🎉 Account created successfully! Redirecting to medications...');
        this.router.navigate(['/medications']);
        
      } catch (error) {
        console.error('Registration error:', error);
        this.statusMessage = '❌ Registration failed';
        alert('Registration failed. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }, 1500);
  }

  // Quick fill for testing
  quickFill() {
    this.userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };
    this.statusMessage = '✅ Form auto-filled for testing';
  }

  // Check form validity
  isFormValid(): boolean {
    return this.userData.fullName.length > 0 && 
           this.userData.email.length > 0 && 
           this.userData.password.length >= 6;
  }
}
