import { Routes } from '@angular/router';
import { AgentDashboardComponent } from './dashboard/agent.component';
import { roleGuard } from '../../core/guards/role.guard';

export const AGENT_ROUTES: Routes = [
  {
    path: '',
    component: AgentDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['INSURANCE_AGENT'] },
  },
];
