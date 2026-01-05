import { Routes } from '@angular/router';
import { ClaimsOfficerComponent } from './dashboard/claims-officer.component';
import { roleGuard } from '../../core/guards/role.guard';

export const CLAIMS_ROUTES: Routes = [
  {
    path: '',
    component: ClaimsOfficerComponent,
    canActivate: [roleGuard],
    data: { roles: ['CLAIMS_OFFICER'] },
  },
];
