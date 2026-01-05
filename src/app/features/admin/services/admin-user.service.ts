import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private baseUrl = 'http://localhost:8081/user-management/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createUser(payload: any) {
    return this.http.post(this.baseUrl, payload);
  }

  updateUser(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
