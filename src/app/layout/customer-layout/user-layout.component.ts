import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerHeaderComponent } from './user-header.component';

@Component({
  standalone: true,
  selector: 'app-customer-layout',
  imports: [CommonModule, RouterOutlet, CustomerHeaderComponent, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class CustomerLayoutComponent {}
