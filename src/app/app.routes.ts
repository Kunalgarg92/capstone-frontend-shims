import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AgentLayoutComponent } from './layout/agent-layout/agent-layout.component';
import { HospitalLayoutComponent } from './layout/hospital-layout/hospital-layout.component';
import { ClaimsLayoutComponent } from './layout/claim-officer-layout/claims-officer-layout.component';
import { CustomerLayoutComponent } from './layout/customer-layout/user-layout.component';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['CUSTOMER'] },
    loadChildren: () =>
      import('./features/customer/customer.routes').then((m) => m.CUSTOMER_ROUTES),
  },
  {
    path: 'agent',
    component: AgentLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['INSURANCE_AGENT'] },
    loadChildren: () => import('./features/agent/agent.routes').then((m) => m.AGENT_ROUTES),
  },
  {
    path: 'hospital',
    component: HospitalLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['HOSPITAL'] },
    loadChildren: () =>
      import('./features/hospital/hospital.routes').then((m) => m.HOSPITAL_ROUTES),
  },
  {
    path: 'claims-officer',
    component: ClaimsLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['CLAIMS_OFFICER'] },
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
