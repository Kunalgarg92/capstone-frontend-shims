// hospital.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../services/hospital.service';

@Component({
  standalone: true,
  selector: 'app-hospital-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
})
export class HospitalDashboardComponent implements OnInit {
  private hospitalService = inject(HospitalService);
  private fb = inject(FormBuilder);

  customers = this.hospitalService.customersSignal;
  activePolicies = signal<any[]>([]);

  // Signal to store the claims list
  hospitalClaims = signal<any[]>([]);

  selectedUser: any = null;
  selectedPolicy: any = null;
  selectedFiles: File[] = [];
  claimForm!: FormGroup;
  message = { text: '', type: '' };

  ngOnInit(): void {
    this.hospitalService.loadCustomers();
    this.loadClaims(); // Load table on init
    this.initForm();
  }

  loadClaims() {
    this.hospitalService.getHospitalClaims().subscribe({
      next: (res) => this.hospitalClaims.set(res.reverse()), // Newest first
      error: (err) => console.error('Failed to load claims', err),
    });
  }

  initForm() {
    this.claimForm = this.fb.group({
      patientName: ['', Validators.required],
      treatmentCost: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/pdf') {
          this.selectedFiles.push(files[i]);
        } else {
          this.showFeedback(`${files[i].name} is not a PDF`, 'error');
        }
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.selectedPolicy = null;
    this.hospitalService.getActivePolicies(user.id).subscribe((res) => {
      this.activePolicies.set(res);
    });
  }

  initiateClaim(policy: any) {
    this.selectedPolicy = policy;
  }

  submitClaim() {
    if (this.claimForm.invalid || !this.selectedPolicy || this.selectedFiles.length === 0) {
      this.showFeedback('Please fill all fields and upload at least one PDF bill.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('policyId', this.selectedPolicy.id);
    formData.append('userId', this.selectedUser.id);
    formData.append('patientName', this.claimForm.get('patientName')?.value);
    formData.append('treatmentCost', this.claimForm.get('treatmentCost')?.value);

    this.selectedFiles.forEach((file) => {
      formData.append('documents', file, file.name);
    });

    this.hospitalService.submitClaim(formData).subscribe({
      next: () => {
        this.showFeedback('Claim & Documents submitted successfully!', 'success');
        this.loadClaims(); // <--- REFRESH THE TABLE DATA
        this.resetWorkflow();
      },
      error: (err) => this.showFeedback(err.error?.message || 'Submission failed', 'error'),
    });
  }

  resetWorkflow() {
    this.selectedUser = null;
    this.selectedPolicy = null;
    this.selectedFiles = [];
    this.activePolicies.set([]);
    this.claimForm.reset();
  }

  showFeedback(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => (this.message = { text: '', type: '' }), 4000);
  }

  // Helper for status styling
  getStatusClass(status: string) {
    return {
      'status-submitted': status === 'SUBMITTED',
      'status-approved': status === 'APPROVED',
      'status-rejected': status === 'REJECTED',
    };
  }
}
