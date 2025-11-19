import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  color: string;
}

@Component({
  selector: 'app-family-management',
  templateUrl: './family-management.page.html',
  styleUrls: ['./family-management.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class FamilyManagementPage implements OnInit {
  familyMembers: FamilyMember[] = [];
  showAddForm = false;
  
  newMemberName: string = '';
  newMemberRelationship: string = 'Self';
  
  relationships = ['Self', 'Spouse', 'Child', 'Parent', 'Grandparent', 'Sibling', 'Other'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFamilyMembers();
  }

  loadFamilyMembers() {
    const stored = localStorage.getItem('familyMembers');
    console.log('Loaded from storage:', stored);
    
    if (stored) {
      this.familyMembers = JSON.parse(stored);
    } else {
      // Add default member
      this.familyMembers = [{
        id: this.generateId(),
        name: 'Me',
        relationship: 'Self',
        color: '#3880ff'
      }];
      this.saveToStorage();
    }
    console.log('Current members:', this.familyMembers);
  }

  saveToStorage() {
    localStorage.setItem('familyMembers', JSON.stringify(this.familyMembers));
    console.log('Saved to storage:', this.familyMembers);
  }

  generateId(): string {
    return Date.now().toString();
  }

  getRandomColor(): string {
    const colors = ['#3880ff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409', '#eb445a'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addFamilyMember() {
    console.log('Add button clicked!');
    console.log('Name:', this.newMemberName);
    console.log('Relationship:', this.newMemberRelationship);
    
    if (this.newMemberName && this.newMemberName.trim()) {
      const newMember: FamilyMember = {
        id: this.generateId(),
        name: this.newMemberName.trim(),
        relationship: this.newMemberRelationship,
        color: this.getRandomColor()
      };
      
      this.familyMembers.push(newMember);
      this.saveToStorage();
      
      alert(`✅ ${newMember.name} added successfully!`);
      
      // Reset form
      this.newMemberName = '';
      this.newMemberRelationship = 'Self';
      this.showAddForm = false;
      
    } else {
      alert('❌ Please enter a name for the family member');
    }
  }

  deleteMember(member: FamilyMember, event: Event) {
    event.stopPropagation();
    if (confirm(`Remove ${member.name}?`)) {
      this.familyMembers = this.familyMembers.filter(m => m.id !== member.id);
      this.saveToStorage();
      alert(`🗑️ ${member.name} removed`);
    }
  }

  viewMember(member: FamilyMember) {
    alert(`👨‍👩‍👧‍👦 Viewing ${member.name} (${member.relationship})\n\nMedication management for ${member.name} will be implemented here.`);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Quick test method
  addTestData() {
    const testMembers = [
      { id: this.generateId(), name: 'Sarah Wilson', relationship: 'Spouse', color: '#eb445a' },
      { id: this.generateId(), name: 'Emma Wilson', relationship: 'Child', color: '#ffc409' },
      { id: this.generateId(), name: 'John Wilson', relationship: 'Parent', color: '#2dd36f' }
    ];
    
    this.familyMembers = [...this.familyMembers, ...testMembers];
    this.saveToStorage();
    alert('🧪 Test data added! Check the family list.');
  }

  clearAll() {
    if (confirm('Clear all family members?')) {
      this.familyMembers = [{
        id: this.generateId(),
        name: 'Me',
        relationship: 'Self',
        color: '#3880ff'
      }];
      this.saveToStorage();
      alert('🧹 All family members cleared!');
    }
  }
}
