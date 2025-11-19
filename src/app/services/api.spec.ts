import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Medication {
  _id?: string;
  name: string;
  dosage: string;
  frequency: {
    type: string;
    timesPerDay?: number;
    times: string[];
  };
  startDate: string;
  instructions?: string;
  inventory: {
    totalQuantity: number;
    currentQuantity: number;
    refillThreshold: number;
  };
  isActive?: boolean;
  status?: 'taken' | 'pending' | 'missed';
  lastTaken?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('medisync_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Auth endpoints
  register(userData: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  // Medication endpoints
  getMedications() {
    return this.http.get<Medication[]>(`${this.apiUrl}/medications`, { headers: this.getHeaders() });
  }

  addMedication(medication: Medication) {
    return this.http.post<{message: string, medication: Medication}>(
      `${this.apiUrl}/medications`, 
      medication, 
      { headers: this.getHeaders() }
    );
  }

  updateMedication(id: string, medication: Medication) {
    return this.http.put<{message: string, medication: Medication}>(
      `${this.apiUrl}/medications/${id}`, 
      medication, 
      { headers: this.getHeaders() }
    );
  }

  deleteMedication(id: string) {
    return this.http.delete<{message: string}>(`${this.apiUrl}/medications/${id}`, { headers: this.getHeaders() });
  }

  logMedication(medicationId: string, status: string, notes?: string) {
    return this.http.post<{message: string, log: any}>(
      `${this.apiUrl}/medications/${medicationId}/log`,
      { status, notes },
      { headers: this.getHeaders() }
    );
  }
}