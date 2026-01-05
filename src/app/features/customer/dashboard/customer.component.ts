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

  // activeTab = signal<'plans' | 'policies' | 'claims' | 'claim_form'>('plans');
  activeTab = signal<'plans' | 'policies' | 'policy_details' | 'claims' | 'claim_form'>('plans');
  plans = signal<any[]>([]);
  myPolicies = signal<any[]>([]);
  myClaims = signal<any[]>([]);
  selectedPolicy = signal<any | null>(null);
  premiumSchedule = signal<any[]>([]);
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

  generatePremiumSchedule(policy: any) {
    const schedule: any[] = [];

    const startDate = new Date(policy.startDate);
    const years = policy.plan.durationYears;
    const premium = policy.plan.premiumAmount;

    // 1️⃣ Generate base schedule
    for (let i = 0; i < years; i++) {
      const dueDate = new Date(startDate);
      dueDate.setFullYear(startDate.getFullYear() + i);

      schedule.push({
        year: i + 1,
        amount: premium,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'DUE',
      });
    }

    // Show immediately
    this.premiumSchedule.set(schedule);
    this.service.getPaymentsForPolicy(policy.id, this.userId).subscribe({
      next: (payments) => {
        if (!payments || payments.length === 0) return;

        const hasSuccess = payments.some((p: any) => p.status === 'SUCCESS');

        const hasPending = payments.some((p: any) => p.status === 'CREATED');

        if (hasSuccess) {
          schedule[0].status = 'SUCCESS';
        } else if (hasPending) {
          schedule[0].status = 'PENDING';
        }

        this.premiumSchedule.set([...schedule]);
      },
      error: () => {
        this.premiumSchedule.set([...schedule]);
      },
    });
  }

  openPolicyDetails(policy: any) {
    this.selectedPolicy.set(policy);
    this.generatePremiumSchedule(policy);
    this.activeTab.set('policy_details');
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

  payPremium(premium: any) {
    const policy = this.selectedPolicy();

    if (!policy) {
      alert('Policy not selected');
      return;
    }

    // 1️⃣ Create order from backend
    this.service
      .createPaymentOrder({
        policyId: policy.id,
        userId: this.userId,
        amount: premium.amount,
      })
      .subscribe({
        next: (res) => {
          this.openRazorpay(res, premium);
        },
        error: () => {
          alert('Unable to initiate payment. Please try again.');
        },
      });
  }

  openRazorpay(order: any, premium: any) {
    const options = {
      key: order.key,
      amount: order.amount * 100,
      currency: 'INR',
      name: 'Health Insurance',
      description: 'Annual Premium Payment',
      order_id: order.orderId,

      handler: (response: any) => {
        this.verifyPayment(response, premium);
      },

      modal: {
        ondismiss: () => {
          alert('Payment cancelled');
        },
      },

      prefill: {
        name: 'Policy Holder',
        email: 'test@example.com',
      },

      theme: {
        color: '#2563eb',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any, premium: any) {
    this.service
      .verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
      .subscribe({
        next: () => {
          premium.status = 'SUCCESS';
          alert('Payment successful');
          const policy = this.selectedPolicy();
          if (policy) {
            this.generatePremiumSchedule(policy);
          }
        },
        error: () => {
          premium.status = 'PENDING';

          alert('Payment received but verification is pending. Please wait or contact support.');
          const policy = this.selectedPolicy();
          if (policy) {
            this.generatePremiumSchedule(policy);
          }
        },
      });
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
