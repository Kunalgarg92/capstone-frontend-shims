// customer.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);

  private policyUrl = 'http://localhost:8081/policy-service/api';
  private claimUrl = 'http://localhost:8081/claims-service/api/claims';
  private paymentUrl = 'http://localhost:8081/policy-service/api/payments';

  // Plans & Enrollment
  getAvailablePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyUrl}/admin/plans`);
  }

  enrollInPlan(enrollmentData: any): Observable<any> {
    return this.http.post(`${this.policyUrl}/policies/enroll`, enrollmentData);
  }

  getPaymentsForPolicy(policyId: number, userId: number) {
    return this.http.get<any[]>(`${this.paymentUrl}/policy/${policyId}/user/${userId}`);
  }

  // User Specific Data
  getUserPolicies(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyUrl}/policies/user/${userId}`);
  }

  createPaymentOrder(data: { policyId: number; userId: number; amount: number }): Observable<any> {
    return this.http.post(`${this.paymentUrl}/create-order`, data);
  }

  verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Observable<any> {
    return this.http.post(`${this.paymentUrl}/verify`, data);
  }

  getUserClaims(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.claimUrl}/user/${userId}`);
  }

  // Claim Submission (Form Data for Multimedia)
  submitClaim(formData: FormData): Observable<any> {
    return this.http.post(this.claimUrl, formData);
  }
}
