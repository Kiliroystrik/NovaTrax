import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginCredentials } from '../interfaces/LoginCredentials';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  // Méthode pour se connecter
  login(credentials: LoginCredentials): Observable<any> {
    this.loadingService.show(); // Activer le loader
    return this.http.post(`${this.apiUrl}/api/login_check`, credentials).pipe(
      tap((response: any) => {
        this.setSession(response.token, response.refresh_token);
      }),
      finalize(() => this.loadingService.hide()) // Désactiver le loader à la fin de l'opération
    );
  }

  // Méthode d'enregistrement
  register(userData: any): Observable<any> {
    this.loadingService.show(); // Activer le loader
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      finalize(() => this.loadingService.hide()) // Désactiver le loader à la fin de l'opération
    );
  }

  // Stocker le token dans sessionStorage
  private setSession(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    this.accessTokenSubject.next(accessToken);
  }

  // Obtenir le token d'accès depuis sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  // Obtenir le refresh token depuis sessionStorage
  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }

  // Rafraîchir le token d'accès
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.loadingService.show(); // Activer le loader
      return this.http.post(`${this.apiUrl}/api/token/refresh`, { refresh_token: refreshToken }).pipe(
        tap((response: any) => {
          this.setSession(response.token, response.refresh_token);
        }),
        finalize(() => this.loadingService.hide()) // Désactiver le loader à la fin de l'opération
      );
    }
    return new Observable(observer => {
      observer.error('No refresh token available');
    });
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getAccessToken(); // Renvoie true si un access_token est présent
  }

  // Méthode de déconnexion
  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    this.accessTokenSubject.next(null);
  }
}
