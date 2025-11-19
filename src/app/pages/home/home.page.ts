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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage {
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

  // Logout method
  logout() {
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  // Medication methods
  addMedication() {
    if (this.newMedication.name && this.newMedication.dosage) {
      this.newMedication.id = Date.now();
      this.medications.push({...this.newMedication});
      this.resetMedicationForm();
      this.showMedicationForm = false;
      console.log('Medication added:', this.newMedication);
    }
  }

  removeMedication(id: number) {
    this.medications = this.medications.filter(med => med.id !== id);
  }

  toggleMedicationForm() {
    this.showMedicationForm = !this.showMedicationForm;
    if (!this.showMedicationForm) {
      this.resetMedicationForm();
    }
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

  getMedicationsCount(): number {
    return this.medications.length;
  }
}
