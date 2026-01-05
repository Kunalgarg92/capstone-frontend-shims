import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaimsOfficerHeaderComponent } from './claims-officer-header.component';

@Component({
  standalone: true,
  selector: 'app-claims-officer-layout',
  imports: [CommonModule, RouterOutlet, ClaimsOfficerHeaderComponent],
  templateUrl: './claims-officer-layout.component.html',
  styleUrls: ['./claims-officer-layout.component.scss'],
})
export class ClaimsOfficerLayoutComponent {}
