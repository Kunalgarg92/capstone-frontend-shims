import { Component, OnInit, inject, signal } from '@angular/core'; // 1. Ensure 'signal' is imported
import { CommonModule } from '@angular/common';
import { HospitalService } from '../services/hospital.service';

@Component({
  standalone: true,
  selector: 'app-hospital-history',
  imports: [CommonModule],
  templateUrl: './hospital-history.component.html',
  styleUrls: ['./hospital-history.component.scss'],
})
export class HospitalHistoryComponent implements OnInit {
  private hospitalService = inject(HospitalService);

  // 2. Ensure this is defined as a signal, NOT a plain array
  // DO NOT add ": any[]" before the "=" sign
  hospitalClaims = signal<any[]>([]);

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims() {
    this.hospitalService.getHospitalClaims().subscribe({
      // 3. Use .set() to update a signal
      next: (res) => this.hospitalClaims.set(res.reverse()),
      error: (err) => console.error('Failed to load claims', err),
    });
  }

  getStatusClass(status: string) {
    return {
      'status-submitted': status === 'SUBMITTED',
      'status-approved': status === 'APPROVED',
      'status-rejected': status === 'REJECTED',
    };
  }
}
