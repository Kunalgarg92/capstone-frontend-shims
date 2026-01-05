import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-agent-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.scss'],
})
export class AgentHeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
