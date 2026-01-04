import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./features/customer/customer.routes').then((m) => m.CUSTOMER_ROUTES),
  },
  {
    path: 'agent',
    loadChildren: () => import('./features/agent/agent.routes').then((m) => m.AGENT_ROUTES),
  },
  {
    path: 'hospital',
    loadChildren: () =>
      import('./features/hospital/hospital.routes').then((m) => m.HOSPITAL_ROUTES),
  },
  {
    path: 'claims-officer',
    loadChildren: () =>
      import('./features/claims-officer/claims-officer.routes').then((m) => m.CLAIMS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
