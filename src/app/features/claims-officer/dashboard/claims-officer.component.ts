// claims-officer.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimsOfficerService } from '../service/claims-officer.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claims-officer.component.html',
  styleUrls: ['./claims-officer.component.scss']
})
export class ClaimsOfficerComponent implements OnInit {
  private service = inject(ClaimsOfficerService);

  pendingClaims = signal<any[]>([]);
  selectedClaim: any = null;
  selectedPolicy: any = null;
  remarks: string = '';

  calculatedPayout = 0;
  isOverLimit = false;

  ngOnInit() { this.loadData(); }

  loadData() {
    this.service.getPendingClaims().subscribe(res => this.pendingClaims.set(res));
  }

  totalLiability() {
    return this.pendingClaims().reduce((acc, curr) => acc + curr.treatmentCost, 0);
  }

  selectClaim(claim: any) {
    this.selectedClaim = claim;
    this.remarks = '';
    
    // Fetch policy to calculate payout logic
    this.service.getPolicyDetails(claim.policyId).subscribe(policy => {
      this.selectedPolicy = policy;
      this.calculatePayout();
    });
  }

  calculatePayout() {
    const cost = this.selectedClaim.treatmentCost;
    const limit = this.selectedPolicy.plan.coverageLimit;

    if (cost > limit) {
      this.calculatedPayout = limit;
      this.isOverLimit = true;
    } else {
      this.calculatedPayout = cost;
      this.isOverLimit = false;
    }
  }

  processAction(type: 'approve' | 'reject') {
    const id = this.selectedClaim.id;
    const call = type === 'approve' 
      ? this.service.approveClaim(id, this.remarks)
      : this.service.rejectClaim(id, this.remarks);

    call.subscribe({
      next: () => {
        alert(`Claim ${type === 'approve' ? 'Paid & Approved' : 'Rejected'} successfully!`);
        this.selectedClaim = null;
        this.loadData();
      }
    });
  }
}