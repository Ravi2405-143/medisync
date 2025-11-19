import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

interface Medication {
  _id?: string;
  name: string;
  dosage: string;
  frequency: {
    type: string;
    timesPerDay?: number;
    times: string[];
  };
  startDate: string;
  endDate?: string;
  isCompleted?: boolean;
  instructions?: string;
  inventory: {
    totalQuantity: number;
    currentQuantity: number;
    refillThreshold: number;
  };
}

@Component({
  selector: 'app-edit-medication',
  templateUrl: './edit-medication.page.html',
  styleUrls: ['./edit-medication.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditMedicationPage {
  medication: Medication = {
    name: '',
    dosage: '',
    frequency: {
      type: 'daily',
      times: ['08:00 AM']
    },
    startDate: new Date().toISOString().split('T')[0],
    instructions: '',
    inventory: {
      totalQuantity: 30,
      currentQuantity: 30,
      refillThreshold: 10
    }
  };

  isEditMode = false;
  availableTimes = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'];

  private navCtrl = inject(NavController);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const medicationData = history.state.medication;
    if (medicationData) {
      this.medication = { ...medicationData };
      this.isEditMode = true;
    }
  }

  addTimeSlot() {
    this.medication.frequency.times.push('08:00 AM');
  }

  removeTimeSlot(index: number) {
    if (this.medication.frequency.times.length > 1) {
      this.medication.frequency.times.splice(index, 1);
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  saveMedication() {
    console.log('Saving medication:', this.medication);
    
    // Show success message
    this.showSuccess();
  }

  deleteMedication() {
    if (confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
      console.log('Deleting medication:', this.medication.name);
      this.navCtrl.back();
    }
  }

  private async showSuccess() {
    const message = this.isEditMode ? 
      `"${this.medication.name}" updated successfully!` : 
      `"${this.medication.name}" added successfully!`;
    
    alert(message);
    this.navCtrl.back();
  }

  cancel() {
    this.navCtrl.back();
  }
}