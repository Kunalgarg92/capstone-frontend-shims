import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-claims-header',
  imports: [CommonModule],
  templateUrl: './claims-officer-header.component.html',
  styleUrls: ['./claims-officer-header.component.scss'],
})
export class ClaimsHeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
