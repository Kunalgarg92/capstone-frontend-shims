// import { Routes } from '@angular/router';
// import { AdminDashboardComponent } from './dashboard/admin.component';

// export const ADMIN_ROUTES: Routes = [
//   {
//     path: '',
//     children: [
//       { path: '', component: AdminDashboardComponent },
//       { path: 'users', component: AdminDashboardComponent },
//       { path: 'plans', component: AdminDashboardComponent },
//     ],
//   },
// ];

import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: AdminDashboardComponent },
  { path: 'plans', component: AdminDashboardComponent },
];
