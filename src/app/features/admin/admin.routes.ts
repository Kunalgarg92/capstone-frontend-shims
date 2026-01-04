import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin.component';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
];
