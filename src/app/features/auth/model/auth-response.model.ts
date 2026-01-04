export interface AuthResponse {
  userId: number;
  role: 'ADMIN' | 'CUSTOMER' | 'INSURANCE_AGENT' | 'HOSPITAL' | 'CLAIMS_OFFICER';
  accessToken: string;
}
