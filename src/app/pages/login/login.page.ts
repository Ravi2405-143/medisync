import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  mobileNumber: string = '';
  name: string = '';
  isRegistering: boolean = false;
  
  // Medication properties
  medications: Medication[] = [];
  showMedicationForm: boolean = false;
  newMedication: Medication = {
    id: 0,
    name: '',
    dosage: '',
    frequency: '',
    time: ''
  };

  constructor(private router: Router) {}

  // Login method
  login() {
    if (!this.email || !this.password) {
      console.log('Please enter email and password');
      return;
    }
    
    console.log('Logging in with:', this.email);
    // Add your actual login logic here
    this.router.navigate(['/home']);
  }

  // Toggle between login and register forms
  toggleRegister() {
    this.isRegistering = !this.isRegistering;
    this.email = '';
    this.password = '';
    this.mobileNumber = '';
    this.name = '';
  }

  // Register with name and mobile number
  register() {
    if (!this.name || !this.mobileNumber || !this.email || !this.password) {
      console.log('Please fill all fields');
      return;
    }
    
    console.log('Registering with:', {
      name: this.name,
      mobile: this.mobileNumber,
      email: this.email
    });
    
    // Add your actual registration logic here
    // After successful registration, switch back to login
    this.isRegistering = false;
  }

  // Medication methods
  addMedication() {
    if (this.newMedication.name && this.newMedication.dosage) {
      this.newMedication.id = Date.now();
      this.medications.push({...this.newMedication});
      this.resetMedicationForm();
      this.showMedicationForm = false;
    }
  }

  removeMedication(id: number) {
    this.medications = this.medications.filter(med => med.id !== id);
  }

  toggleMedicationForm() {
    this.showMedicationForm = !this.showMedicationForm;
  }

  resetMedicationForm() {
    this.newMedication = {
      id: 0,
      name: '',
      dosage: '',
      frequency: '',
      time: ''
    };
  }
}
