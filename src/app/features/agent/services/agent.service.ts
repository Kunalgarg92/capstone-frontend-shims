import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'; // Ensure Observable is imported here

@Injectable({ providedIn: 'root' })
export class AgentService {
  private userUrl = 'http://localhost:8081/user-management/api/admin/users';
  private planUrl = 'http://localhost:8081/policy-service/api/admin/plans';
  private policyUrl = 'http://localhost:8081/policy-service/api/policies';

  // 1. The 'S' Word: Define the Signal
  public customersSignal = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadCustomers(): void {
    this.http
      .get<any[]>(this.userUrl)
      .pipe(
        map((users) => {
          if (!Array.isArray(users)) return [];
          return users.filter((u) => u.role?.toUpperCase() === 'CUSTOMER');
        })
      )
      .subscribe({
        next: (data) => this.customersSignal.set(data),
        error: (err) => console.error('Signal Load Error:', err),
      });
  }

  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(this.planUrl);
  }

  getUserPolicies(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyUrl}/user/${userId}`);
  }

  enroll(userId: number, planId: number): Observable<any> {
    const payload = {
      userId,
      planId,
      startDate: new Date().toISOString().split('T')[0],
    };
    return this.http.post(`${this.policyUrl}/enroll`, payload);
  }

  suspendPolicy(policyId: number, userId: number, planId: number): Observable<any> {
    const payload = { userId, planId, startDate: new Date().toISOString().split('T')[0] };
    return this.http.put(`${this.policyUrl}/${policyId}/suspend`, payload);
  }

  renewPolicy(policyId: number, userId: number, planId: number): Observable<any> {
    const payload = { userId, planId, startDate: new Date().toISOString().split('T')[0] };
    return this.http.put(`${this.policyUrl}/${policyId}/renew`, payload);
  }
}
