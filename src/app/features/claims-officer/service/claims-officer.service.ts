import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClaimsOfficerService {
  private claimUrl = 'http://localhost:8081/claims-service/api/claims';
  private policyUrl = 'http://localhost:8081/policy-service/api/policies';

  constructor(private http: HttpClient) {}

  getPendingClaims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.claimUrl}/pending`);
  }

  getPolicyDetails(policyId: number): Observable<any> {
    return this.http.get<any>(`${this.policyUrl}/${policyId}`);
  }

  approveClaim(id: number, remarks: string): Observable<any> {
    return this.http.put(`${this.claimUrl}/${id}/approve`, { remarks });
  }

  rejectClaim(id: number, remarks: string): Observable<any> {
    return this.http.put(`${this.claimUrl}/${id}/reject`, { remarks });
  }
}
