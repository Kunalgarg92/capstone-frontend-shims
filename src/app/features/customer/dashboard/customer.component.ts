// customer-dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  private service = inject(CustomerService);

  activeTab = signal<'plans' | 'policies' | 'claims' | 'claim_form'>('plans');
  plans = signal<any[]>([]);
  myPolicies = signal<any[]>([]);
  myClaims = signal<any[]>([]);
  selectedPolicyForClaim: any = null;

  userId: number = 0;

  ngOnInit() {
    // 1. Load plans immediately so the UI is NEVER empty
    this.loadPlans();

    // 2. Get User ID the "easy" way (Checking common storage keys)
    this.detectUser();
  }

  detectUser() {
    // Check common keys used by Angular Auth systems
    const storageId =
      localStorage.getItem('userId') ||
      localStorage.getItem('id') ||
      sessionStorage.getItem('userId');

    if (storageId) {
      this.userId = parseInt(storageId);
    } else {
      // If it's stored inside a JSON object (like your guard might be doing)
      const userObj = localStorage.getItem('user') || localStorage.getItem('currentUser');
      if (userObj) {
        const parsed = JSON.parse(userObj);
        this.userId = parsed.id || parsed.userId;
      }
    }

    console.log('Customer Dashboard using UserID:', this.userId);

    if (this.userId > 0) {
      this.loadUserPolicies();
      this.loadUserClaims();
    }
  }

  loadPlans() {
    this.service.getAvailablePlans().subscribe({
      next: (res) => {
        console.log('Plans loaded:', res);
        this.plans.set(res);
      },
      error: (err) => console.error('Plan fetch failed', err),
    });
  }

  loadUserPolicies() {
    this.service.getUserPolicies(this.userId).subscribe((res) => this.myPolicies.set(res));
  }

  isEnrolled(planId: number): boolean {
    return this.myPolicies().some(
      (policy) => policy.planId === planId || (policy.plan && policy.plan.id === planId)
    );
  }

  loadUserClaims() {
    this.service.getUserClaims(this.userId).subscribe((res) => this.myClaims.set(res));
  }

  onEnroll(planId: number) {
    if (this.isEnrolled(planId)) {
      alert('You are already enrolled in this plan.');
      return;
    }

    const data = {
      userId: this.userId,
      planId: planId,
      startDate: new Date().toISOString().split('T')[0],
    };

    this.service.enrollInPlan(data).subscribe({
      next: () => {
        alert('Enrolled successfully!');
        this.loadUserPolicies();
        this.activeTab.set('policies');
      },
      error: (err) => alert('Enrollment failed. Please try again later.'),
    });
  }

  openClaimForm(policy: any) {
    this.selectedPolicyForClaim = policy;
    this.activeTab.set('claim_form');
  }

  onFileSelected(event: any, dummy: any) {
    // Placeholder for the change event
  }

  submitClaim(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append('policyId', this.selectedPolicyForClaim.id);
    formData.append('userId', this.userId.toString());

    this.service.submitClaim(formData).subscribe({
      next: () => {
        alert('Claim submitted!');
        this.loadUserClaims();
        this.activeTab.set('claims');
      },
    });
  }

  get formattedUserId(): string {
    return this.userId.toString().padStart(3, '0');
  }
}
