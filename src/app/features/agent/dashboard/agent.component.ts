import { Component, OnInit, inject } from '@angular/core'; // 1. Add inject
import { CommonModule } from '@angular/common';
import { AgentService } from '../services/agent.service';

@Component({
  standalone: true,
  selector: 'app-agent-dashboard',
  imports: [CommonModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentDashboardComponent implements OnInit {
  // 2. Use inject() instead of the constructor
  private agentService = inject(AgentService);

  // 3. Now this line will work perfectly!
  customers = this.agentService.customersSignal;

  plans: any[] = [];
  userPolicies: any[] = [];
  selectedCustomer: any = null;
  loading = false;
  message = { text: '', type: '' };

  // 4. Empty constructor (or remove it if not needed for anything else)
  constructor() {}

  ngOnInit(): void {
    this.agentService.loadCustomers();
    this.loadPlans();
  }

  loadPlans() {
    this.agentService.getPlans().subscribe((res: any[]) => (this.plans = res));
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.agentService.getUserPolicies(customer.id).subscribe((res: any[]) => {
      this.userPolicies = res;
    });
  }

  isAlreadyEnrolled(planId: number): boolean {
    return this.userPolicies.some((p) => p.plan.id === planId && p.status === 'ACTIVE');
  }

  enroll(planId: number) {
    if (!this.selectedCustomer) return;
    this.agentService.enroll(this.selectedCustomer.id, planId).subscribe({
      next: () => {
        this.showFeedback('Enrolled Successfully', 'success');
        this.selectCustomer(this.selectedCustomer);
      },
      error: () => this.showFeedback('Enrollment Failed', 'error'),
    });
  }

  suspend(policy: any) {
    this.agentService.suspendPolicy(policy.id, policy.userId, policy.plan.id).subscribe(() => {
      this.showFeedback('Policy Suspended', 'success');
      this.selectCustomer(this.selectedCustomer);
    });
  }

  renew(policy: any) {
  this.agentService.renewPolicy(policy.id, policy.userId, policy.plan.id).subscribe({
    next: () => {
      this.showFeedback('Policy Renewed successfully', 'success');
      this.selectCustomer(this.selectedCustomer);
    },
    error: (err) => {
      const errorMessage = err.error?.message || 'Renewal failed';
      this.showFeedback(`Error: ${errorMessage}`, 'error');
      console.error('Backend Conflict:', err);
    }
  });
}

  showFeedback(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => (this.message = { text: '', type: '' }), 3000);
  }
}
