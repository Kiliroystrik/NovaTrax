import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken();

    // Ne pas intercepter la requête de refresh token
    if (req.url.includes('/api/token_refresh')) {
        return next(req);
    }

    const clonedReq = accessToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;

    return next(clonedReq).pipe(
        tap(event => {
            if (event.type === HttpEventType.Response) {
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return handle401Error(clonedReq, next, authService);
            } else {
                return throwError(() => error);
            }
        })
    );
}


function handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService
): Observable<HttpEvent<unknown>> {
    return authService.refreshAccessToken().pipe(
        switchMap((newTokens: any) => {
            if (newTokens && newTokens.token) {
                const clonedRequest = request.clone({
                    setHeaders: { Authorization: `Bearer ${newTokens.token}` }
                });
                return next(clonedRequest);  // Réessayer la requête avec le nouveau token
            } else {
                authService.logout(); // Si pas de nouveaux tokens valides
                return throwError(() => new Error('Token refresh failed'));
            }
        }),
        catchError(error => {
            authService.logout();  // Déconnecter en cas d'échec
            return throwError(() => error);
        })
    );
}


