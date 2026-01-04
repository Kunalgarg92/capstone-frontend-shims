import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data?.['roles'];
  const userRole = authService.getRole();

  console.log('🛡 RoleGuard → userRole:', userRole);
  console.log('🛡 RoleGuard → allowedRoles:', allowedRoles);

  if (!userRole || !allowedRoles) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
