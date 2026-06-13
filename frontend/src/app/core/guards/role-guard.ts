import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const expectedRoles = route.data['roles'] as Array<string>;
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles && !expectedRoles.includes(currentUser.role)) {
    toastr.error(
      'You do not have permission to access this page',
      'Access Denied'
    );
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};