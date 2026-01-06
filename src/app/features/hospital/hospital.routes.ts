import { Routes } from '@angular/router';
import { HospitalDashboardComponent } from './dashboard/hospital.component';
import { HospitalHistoryComponent } from './history/hospital-history.component';
import { roleGuard } from '../../core/guards/role.guard';

export const HOSPITAL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: HospitalDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['HOSPITAL'] },
  },
  {
    path: 'history',
    component: HospitalHistoryComponent,
    canActivate: [roleGuard],
    data: { roles: ['HOSPITAL'] },
  },
];
