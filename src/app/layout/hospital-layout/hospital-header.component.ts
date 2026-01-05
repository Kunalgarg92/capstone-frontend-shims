import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-hospital-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './hospital-header.component.html',
  styleUrls: ['./hospital-header.component.scss'],
})
export class HospitalHeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
