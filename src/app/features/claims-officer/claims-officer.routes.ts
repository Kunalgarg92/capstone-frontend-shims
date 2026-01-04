import { Routes } from '@angular/router';
import { ClaimsDashboardComponent } from './claims-officer.component';
import { roleGuard } from '../../core/guards/role.guard';

export const CLAIMS_ROUTES: Routes = [
  {
    path: '',
    component: ClaimsDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['CLAIMS_OFFICER'] },
  },
];
