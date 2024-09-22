import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);  // Injection de AuthService pour récupérer les tokens
    const accessToken = authService.getAccessToken();  // Récupère le token d'accès stocké

    // Si un token d'accès existe, on l'ajoute aux headers de la requête
    const clonedReq = accessToken
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        : req;

    // On passe la requête (possiblement clonée avec le token) au prochain handler
    return next(clonedReq).pipe(
        // On surveille les événements et vérifie si une réponse est reçue
        tap(event => {
            if (event.type === HttpEventType.Response) {
                console.log('Réponse reçue pour:', req.url);
            }
        }),
        // Gestion des erreurs
        catchError((error: HttpErrorResponse) => {
            // Si l'erreur est 401, cela signifie que le token d'accès a expiré
            if (error.status === 401) {
                return handle401Error(clonedReq, next);
            } else {
                return throwError(() => error);  // On passe l'erreur au prochain gestionnaire d'erreur
            }
        })
    );
}

// Fonction pour gérer une erreur 401 (token expiré)
function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);  // Injection de AuthService pour rafraîchir le token

    return authService.refreshAccessToken().pipe(
        switchMap((newTokens: any) => {
            // Rafraîchir le token et cloner la requête initiale avec le nouveau token
            const clonedRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${newTokens.token}`
                }
            });
            return next(clonedRequest);  // On réessaie la requête avec le nouveau token
        }),
        catchError(error => {
            // Si le rafraîchissement échoue, on redirige l'utilisateur vers la page de login ou autre
            authService.logout();
            return throwError(() => error);
        })
    );
}
