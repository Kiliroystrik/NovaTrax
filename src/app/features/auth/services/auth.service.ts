import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginCredentials } from '../interfaces/LoginCredentials';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  login(credentials: LoginCredentials): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/api/login_check`, credentials).pipe(
      tap((response: any) => {
        this.setSession(response.token, response.refresh_token);
      }),
      finalize(() => this.loadingService.hide()),
      catchError(error => {
        this.loadingService.hide();
        return throwError(() => error);  // Gérer les erreurs dans le login
      })
    );
  }

  register(userData: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      finalize(() => this.loadingService.hide()),
      catchError(error => {
        this.loadingService.hide();
        return throwError(() => error);  // Gérer les erreurs dans l'enregistrement
      })
    );
  }

  private setSession(accessToken: string, refreshToken: string): void {
    if (accessToken && refreshToken) {
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
      this.accessTokenSubject.next(accessToken);
    } else {
      this.logout(); // Si les tokens sont invalides, on déconnecte
    }
  }


  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.loadingService.show(); // Activer le loader
      return this.http.post(`${this.apiUrl}/api/token_refresh`, { refresh_token: refreshToken }).pipe(
        tap((response: any) => {
          if (response.token && response.refresh_token) {
            this.setSession(response.token, response.refresh_token);
          } else {
            this.logout(); // Si la réponse est vide ou incorrecte
          }
        }),
        catchError((error) => {
          this.logout(); // Déconnecter si le refresh échoue
          return throwError(() => error);
        }),
        finalize(() => this.loadingService.hide()) // Désactiver le loader à la fin de l'opération
      );
    } else {
      this.logout(); // Pas de token refresh trouvé
      return throwError(() => new Error('No refresh token available'));
    }
  }



  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    this.accessTokenSubject.next(null);
  }
}
