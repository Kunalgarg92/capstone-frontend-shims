import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'INSURANCE_AGENT' | 'HOSPITAL' | 'CLAIMS_OFFICER';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(payload: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
