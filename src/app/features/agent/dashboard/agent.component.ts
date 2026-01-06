import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../services/agent.service';

@Component({
  standalone: true,
  selector: 'app-agent-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentDashboardComponent implements OnInit {
  private agentService = inject(AgentService);

  customers = this.agentService.customersSignal;
  plans: any[] = [];
  userPolicies: any[] = [];
  selectedCustomer: any = null;
  loading = false;
  message = { text: '', type: '' };

  // EXACTLY what you asked for
  searchTerm = '';
  filteredCustomers = signal<any[]>([]);
  isLoadingCustomers = false;

  constructor() {}

  ngOnInit(): void {
    this.agentService.loadCustomers();
    this.loadPlans();
    // Initialize filtered customers
    this.filteredCustomers.set([]);
  }

  loadPlans() {
    this.agentService.getPlans().subscribe((res: any[]) => (this.plans = res));
  }

  // EXACTLY what you asked for
  getInitials(email: string): string {
    return email.charAt(0).toUpperCase();
  }

  // EXACTLY what you asked for
  filterCustomers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCustomers.set(
      this.customers().filter((c) => c.email.toLowerCase().includes(term))
    );
  }

  // EXACTLY what you asked for
  loadSampleCustomer() {
    if (this.customers().length > 0) {
      this.selectCustomer(this.customers()[0]);
    }
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
      },
    });
  }

  showFeedback(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => (this.message = { text: '', type: '' }), 3000);
  }
}
