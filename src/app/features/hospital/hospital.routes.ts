import { Routes } from '@angular/router';
import { HospitalDashboardComponent } from './hospital.component';
import { roleGuard } from '../../core/guards/role.guard';

export const HOSPITAL_ROUTES: Routes = [
  {
    path: '',
    component: HospitalDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['HOSPITAL'] },
  },
];
