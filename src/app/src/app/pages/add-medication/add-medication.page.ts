import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medication',
  templateUrl: './add-medication.page.html',
  styleUrls: ['./add-medication.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddMedicationPage {
  medication = {
    name: '',
    dosage: '',
    frequency: ''
  };

  constructor(private router: Router) {}

  saveMedication() {
    console.log('Saving medication:', this.medication);
    // Save logic here
    this.router.navigate(['/medications']);
  }

  cancel() {
    this.router.navigate(['/medications']);
  }
}
