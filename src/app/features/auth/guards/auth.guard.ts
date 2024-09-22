import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;  // Si l'utilisateur est connecté, il peut accéder à la route
  } else {
    router.navigate(['/home']);  // Sinon, redirection vers la page principale
    return false;
  }
};
