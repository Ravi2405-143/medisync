import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  taken: boolean;
  lastTaken?: string;
}

@Component({
  selector: 'app-medications',
  templateUrl: './medications.page.html',
  styleUrls: ['./medications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MedicationsPage implements OnInit {
  medications: Medication[] = [];
  hasMedications = false;
  today = new Date().toISOString().split('T')[0];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMedications();
  }

  loadMedications() {
    const storedMedications = localStorage.getItem('medications');
    this.medications = storedMedications ? JSON.parse(storedMedications) : [];
    
    // Reset taken status for new day
    this.medications = this.medications.map(med => {
      const lastTakenDate = med.lastTaken ? med.lastTaken.split('T')[0] : null;
      if (lastTakenDate !== this.today) {
        return { ...med, taken: false };
      }
      return med;
    });
    
    this.saveMedications();
    this.hasMedications = this.medications.length > 0;
  }

  saveMedications() {
    localStorage.setItem('medications', JSON.stringify(this.medications));
  }

  addFirstMedication() {
    this.router.navigate(['/add-medication']);
  }

  addAnotherMedication() {
    this.router.navigate(['/add-medication']);
  }

  editMedication(medication: Medication) {
    this.router.navigate(['/edit-medication', medication.id]);
  }

  deleteMedication(medication: Medication) {
    if (confirm(`Are you sure you want to delete ${medication.name}?`)) {
      this.medications = this.medications.filter(m => m.id !== medication.id);
      this.saveMedications();
      this.hasMedications = this.medications.length > 0;
    }
  }

  toggleMedicationStatus(medication: Medication, event: Event) {
    event.stopPropagation();
    
    medication.taken = !medication.taken;
    medication.lastTaken = medication.taken ? new Date().toISOString() : undefined;
    
    this.saveMedications();
    
    // Show feedback
    const status = medication.taken ? 'Taken' : 'Not Taken';
    this.showStatusToast(medication.name, status);
  }

  private showStatusToast(medName: string, status: string) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${status === 'Taken' ? '#2dd36f' : '#eb445a'};
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    toast.textContent = `${medName} marked as ${status}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  getMedicationCount(): string {
    const count = this.medications.length;
    return count === 1 ? '1 medication' : `${count} medications`;
  }

  getTakenCount(): string {
    const takenCount = this.medications.filter(m => m.taken).length;
    return `${takenCount}/${this.medications.length} taken today`;
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getLastTakenTime(medication: Medication): string {
    if (!medication.lastTaken) return 'Never taken';
    
    const lastTaken = new Date(medication.lastTaken);
    const now = new Date();
    const diffMs = now.getTime() - lastTaken.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  }

  markAllAsTaken() {
    if (confirm('Mark all medications as taken for today?')) {
      this.medications.forEach(med => {
        med.taken = true;
        med.lastTaken = new Date().toISOString();
      });
      this.saveMedications();
      this.showStatusToast('All medications', 'Taken');
    }
  }

  resetAllStatus() {
    if (confirm('Reset all medication status for today?')) {
      this.medications.forEach(med => {
        med.taken = false;
        med.lastTaken = undefined;
      });
      this.saveMedications();
      this.showStatusToast('All medications', 'Reset');
    }
  }
}
