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
  isTaken: boolean;
  lastTaken?: Date;
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
    time: '',
    isTaken: false
  };

  constructor(private router: Router) {}

  // Logout method
  logout() {
    console.log('Logging out...');
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
      
      // Show notification for new medication
      this.showNotification(`Added: ${this.newMedication.name}`);
    }
  }

  removeMedication(id: number) {
    const medication = this.medications.find(med => med.id === id);
    if (medication) {
      this.medications = this.medications.filter(med => med.id !== id);
      this.showNotification(`Removed: ${medication.name}`);
    }
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
      time: '',
      isTaken: false
    };
  }

  // Mark medication as taken/not taken
  toggleMedicationStatus(medication: Medication) {
    medication.isTaken = !medication.isTaken;
    medication.lastTaken = medication.isTaken ? new Date() : undefined;
    
    // Show notification
    const status = medication.isTaken ? 'Taken' : 'Not Taken';
    this.showNotification(`${medication.name} marked as ${status}`);
  }

  // Save medications for later use
  saveMedications() {
    localStorage.setItem('savedMedications', JSON.stringify(this.medications));
    this.showNotification('All medications saved successfully!');
  }

  // Clear all medications
  clearAllMedications() {
    if (confirm('Are you sure you want to clear all medications?')) {
      this.medications = [];
      localStorage.removeItem('savedMedications');
      this.showNotification('All medications cleared!');
    }
  }

  // Load medications from localStorage on page load
  ngOnInit() {
    this.loadMedicationsFromStorage();
  }

  loadMedicationsFromStorage() {
    const saved = localStorage.getItem('savedMedications');
    if (saved) {
      this.medications = JSON.parse(saved);
    }
  }

  // Notification system
  showNotification(message: string) {
    // Create a simple notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MediSync', {
        body: message,
        icon: 'assets/icon/icon.png'
      });
    }
    
    // Fallback: alert for browsers without notification support
    console.log('Notification:', message);
    
    // You can also show a toast message here
    this.showToast(message);
  }

  // Simple toast notification
  showToast(message: string) {
    // Create a simple toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--ion-color-success);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }

  // Request notification permission
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showNotification('Notifications enabled! You will receive alerts for your medications.');
        }
      });
    }
  }

  getMedicationsCount(): number {
    return this.medications.length;
  }

  getTakenCount(): number {
    return this.medications.filter(med => med.isTaken).length;
  }

  getNotTakenCount(): number {
    return this.medications.filter(med => !med.isTaken).length;
  }

  // Check if any medications need reminders
  checkMedicationReminders() {
    const now = new Date();
    const currentHour = now.getHours();
    
    this.medications.forEach(medication => {
      if (!medication.isTaken) {
        // Simple reminder logic - you can enhance this
        if (medication.time.toLowerCase().includes('morning') && currentHour >= 8 && currentHour <= 10) {
          this.showNotification(`Reminder: Time to take ${medication.name}`);
        } else if (medication.time.toLowerCase().includes('evening') && currentHour >= 18 && currentHour <= 20) {
          this.showNotification(`Reminder: Time to take ${medication.name}`);
        }
      }
    });
  }
}
