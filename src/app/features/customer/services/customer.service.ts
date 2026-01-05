// customer.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);

  private policyUrl = 'http://localhost:8081/policy-service/api';
  private claimUrl = 'http://localhost:8081/claims-service/api/claims';

  // Plans & Enrollment
  getAvailablePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyUrl}/admin/plans`);
  }

  enrollInPlan(enrollmentData: any): Observable<any> {
    return this.http.post(`${this.policyUrl}/policies/enroll`, enrollmentData);
  }

  // User Specific Data
  getUserPolicies(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyUrl}/policies/user/${userId}`);
  }

  getUserClaims(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.claimUrl}/user/${userId}`);
  }

  // Claim Submission (Form Data for Multimedia)
  submitClaim(formData: FormData): Observable<any> {
    return this.http.post(this.claimUrl, formData);
  }
}
