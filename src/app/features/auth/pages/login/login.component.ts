import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());

        const redirectMap: Record<string, string> = {
          ADMIN: '/admin',
          CUSTOMER: '/customer',
          INSURANCE_AGENT: '/agent',
          HOSPITAL: '/hospital',
          CLAIMS_OFFICER: '/claims-officer',
        };

        this.router.navigate([redirectMap[res.role] || '/']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Invalid credentials';
        this.loading = false;
      },
    });
  }
}
