import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-customer-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
})
export class CustomerHeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
