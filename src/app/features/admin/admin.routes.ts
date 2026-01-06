import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin.component';
import { AdminAnalyticsComponent } from './analytics/admin-analytics.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'analytics', component: AdminAnalyticsComponent },
  { path: 'users', component: AdminDashboardComponent },
  { path: 'plans', component: AdminDashboardComponent },
];
