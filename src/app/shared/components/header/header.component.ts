import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/auth/login']);
  }

  register() {
    this.router.navigate(['/auth/register']);
  }
}
