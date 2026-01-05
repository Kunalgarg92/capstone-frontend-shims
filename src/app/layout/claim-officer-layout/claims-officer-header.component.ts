import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-claims-officer-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './claims-officer-header.component.html',
  styleUrls: ['./claims-officer-header.component.scss'],
})
export class ClaimsOfficerHeaderComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}