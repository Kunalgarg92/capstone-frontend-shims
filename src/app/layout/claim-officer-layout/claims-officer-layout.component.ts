import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaimsHeaderComponent } from './claims-officer-header.component';

@Component({
  standalone: true,
  selector: 'app-claims-layout',
  imports: [CommonModule, RouterOutlet, ClaimsHeaderComponent, RouterModule],
  templateUrl: './claims-officer-layout.component.html',
  styleUrls: ['./claims-officer-layout.component.scss'],
})
export class ClaimsLayoutComponent {}
