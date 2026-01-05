import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private userUrl = 'http://localhost:8081/user-management/api/admin/users';
  private policyUrl = 'http://localhost:8081/policy-service/api/policies';
  private claimUrl = 'http://localhost:8081/claims-service/api/claims';
  private hospitalClaimsUrl = 'http://localhost:8081/hospital-service/api/hospitals/claims';

  public customersSignal = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadCustomers() {
    this.http
      .get<any[]>(this.userUrl)
      .pipe(
        map((users) => (Array.isArray(users) ? users.filter((u) => u.role === 'CUSTOMER') : []))
      )
      .subscribe((data) => this.customersSignal.set(data));
  }

  getHospitalClaims(): Observable<any[]> {
    return this.http.get<any[]>(this.hospitalClaimsUrl);
  }

  getActivePolicies(userId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.policyUrl}/user/${userId}`)
      .pipe(map((policies) => policies.filter((p) => p.status === 'ACTIVE')));
  }

  // Updated to handle FormData for real files
  submitClaim(formData: FormData): Observable<any> {
    return this.http.post(this.claimUrl, formData);
  }
}
