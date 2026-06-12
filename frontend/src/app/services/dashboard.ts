import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.url+"/api/dashboard"}`;
  
  constructor(private http: HttpClient) {}
  
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
  
  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}