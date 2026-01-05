import { Routes } from '@angular/router';
import { CustomerDashboardComponent } from './dashboard/customer.component';
import { roleGuard } from '../../core/guards/role.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['CUSTOMER'] },
  },
];
