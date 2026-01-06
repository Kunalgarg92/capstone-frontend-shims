import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // ← Add RouterModule
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './admin-header.component';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule, // ← Add this
    AdminHeaderComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {}
