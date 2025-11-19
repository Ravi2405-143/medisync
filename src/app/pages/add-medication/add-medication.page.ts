import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

export interface Medication {
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
  selector: 'app-add-medication',
  templateUrl: './add-medication.page.html',
  styleUrls: ['./add-medication.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddMedicationPage {
  medication: Medication = {
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: new Date().toISOString(),
    taken: false
  };

  isEdit = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check if editing existing medication
    const medicationId = this.route.snapshot.paramMap.get('id');
    if (medicationId) {
      this.isEdit = true;
      this.loadMedication(medicationId);
    }
  }

  private generateId(): string {
    return 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadMedication(id: string) {
    try {
      const existingMedications = JSON.parse(localStorage.getItem('medications') || '[]');
      const foundMedication = existingMedications.find((m: Medication) => m.id === id);
      
      if (foundMedication) {
        this.medication = { ...foundMedication };
      }
    } catch (error) {
      console.error('Error loading medication:', error);
    }
  }

  saveMedication() {
    console.log('Saving medication:', this.medication);
    
    // Validate required fields
    if (!this.medication.name?.trim() || !this.medication.dosage?.trim() || !this.medication.frequency?.trim()) {
      alert('Please fill in all required fields (Name, Dosage, Frequency)');
      return;
    }
    
    try {
      // Get existing medications from storage
      let existingMedications: Medication[] = [];
      const stored = localStorage.getItem('medications');
      
      if (stored) {
        existingMedications = JSON.parse(stored);
      }
      
      if (this.isEdit) {
        // Update existing medication
        const index = existingMedications.findIndex((m: Medication) => m.id === this.medication.id);
        if (index !== -1) {
          existingMedications[index] = { ...this.medication };
        }
      } else {
        // Add new medication with new ID
        this.medication.id = this.generateId();
        // Ensure new medications start as not taken
        this.medication.taken = false;
        this.medication.lastTaken = undefined;
        existingMedications.push({ ...this.medication });
      }
      
      // Save back to storage
      localStorage.setItem('medications', JSON.stringify(existingMedications));
      console.log('Medications saved to localStorage:', existingMedications);
      
      // Show success message
      alert(`Medication ${this.isEdit ? 'updated' : 'added'} successfully!`);
      
      // Navigate back to medications list
      this.router.navigate(['/medications']);
      
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Error saving medication. Please try again.');
    }
  }

  cancel() {
    this.router.navigate(['/medications']);
  }

  // Add some common medication options for quick selection
  commonMedications = [
    { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
    { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily' },
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily' },
    { name: 'Insulin', dosage: '10 units', frequency: 'Before meals' },
    { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily' },
    { name: 'Albuterol', dosage: '2 puffs', frequency: 'As needed' },
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' }
  ];

  selectCommonMedication(med: any) {
    this.medication.name = med.name;
    this.medication.dosage = med.dosage;
    this.medication.frequency = med.frequency;
    // Reset instructions when selecting common medication
    this.medication.instructions = '';
  }

  // Helper method to clear form
  clearForm() {
    this.medication = {
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      instructions: '',
      startDate: new Date().toISOString(),
      taken: false
    };
  }

  // Check if form has valid data
  get isFormValid(): boolean {
    return !!this.medication.name?.trim() && 
           !!this.medication.dosage?.trim() && 
           !!this.medication.frequency?.trim();
  }

  // Get character count for instructions
  get instructionsCount(): number {
    return this.medication.instructions?.length || 0;
  }

  // Format date for display
  getFormattedDate(): string {
    const date = new Date(this.medication.startDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
