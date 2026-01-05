import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HospitalHeaderComponent } from './hospital-header.component';

@Component({
  standalone: true,
  selector: 'app-hospital-layout',
  imports: [CommonModule, RouterOutlet, HospitalHeaderComponent],
  templateUrl: './hospital-layout.component.html',
  styleUrls: ['./hospital-layout.component.scss'],
})
export class HospitalLayoutComponent {}
