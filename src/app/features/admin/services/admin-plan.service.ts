import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminPlanService {
  private baseUrl = 'http://localhost:8081/policy-service/api/admin/plans';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createPlan(payload: any) {
    return this.http.post(this.baseUrl, payload);
  }

  updatePlan(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deletePlan(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
