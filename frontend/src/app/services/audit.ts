import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.app+"/api/audit-logs"}`;

  constructor(private http: HttpClient) {}

  getAuditLogs(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  getAuditLogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getResourceAuditTrail(resourceType: string, resourceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resource/${resourceType}/${resourceId}`);
  }

  getAuditStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}