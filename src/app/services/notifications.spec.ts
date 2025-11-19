import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  
  async requestPermissions(): Promise<boolean> {
    try {
      // For web - use browser notifications
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  async scheduleMedicationReminder(medication: any, reminderTime: Date) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return;
      }

      // Calculate time until reminder
      const now = new Date();
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      // Only schedule if in the future
      if (timeUntilReminder > 0) {
        setTimeout(() => {
          this.showNotification(medication);
        }, timeUntilReminder);

        console.log('📅 Reminder scheduled for:', medication.name, 'at', reminderTime.toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  }

  async scheduleAllMedicationReminders(medications: any[]) {
    console.log('🔔 Scheduling reminders for', medications.length, 'medications');
    
    for (const medication of medications) {
      if (medication.frequency?.times) {
        for (const timeStr of medication.frequency.times) {
          const reminderTime = this.calculateReminderTime(timeStr);
          await this.scheduleMedicationReminder(medication, reminderTime);
        }
      }
    }
  }

  private showNotification(medication: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MediSync Reminder 💊', {
        body: `Time to take ${medication.name} - ${medication.dosage}`,
        icon: '/assets/icon/favicon.png'
      });
    } else {
      console.log('🔔 Medication Reminder:', `Time to take ${medication.name} - ${medication.dosage}`);
    }
  }

  private calculateReminderTime(timeStr: string): Date {
    const now = new Date();
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    
    const reminder = new Date();
    reminder.setHours(hour24, parseInt(minutes), 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (reminder <= now) {
      reminder.setDate(reminder.getDate() + 1);
    }
    
    return reminder;
  }

  async testNotification() {
    const testMed = {
      name: 'Test Medication',
      dosage: '500mg',
      frequency: { times: [] }
    };
    this.showNotification(testMed);
  }
}