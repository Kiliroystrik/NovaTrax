// src/app/services/status.service.ts

import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';
import { Status } from '../interfaces/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  /**
   * Récupère les statuts en fonction du type spécifié.
   * @param type Le type de statut à récupérer (e.g., 'ClientOrder', 'Delivery', 'Tour').
   * @returns Un Observable contenant un tableau de statuts correspondant au type.
   */
  getStatusesByType(type: string): Observable<Status[]> {
    this.loadingService.show();
    return this.http
      .get<Status[]>(`${this.apiUrl}/api/statuses/type/${type}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /**
   * Récupère un statut spécifique par son ID.
   * @param id L'ID du statut à récupérer.
   * @returns Un Observable contenant le statut correspondant.
   */
  getStatus(id: number): Observable<Status> {
    this.loadingService.show();
    return this.http
      .get<Status>(`${this.apiUrl}/api/statuses/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Si vous avez besoin de créer, mettre à jour ou supprimer des statuts via le frontend,
  // vous pouvez ajouter les méthodes suivantes. Sinon, vous pouvez les omettre.

  /**
   * Crée un nouveau statut.
   * @param status L'objet statut à créer.
   * @returns Un Observable contenant le statut créé.
   */
  createStatus(status: Status): Observable<Status> {
    this.loadingService.show();
    return this.http
      .post<Status>(`${this.apiUrl}/api/statuses`, status)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /**
   * Met à jour un statut existant.
   * @param id L'ID du statut à mettre à jour.
   * @param status Les données mises à jour du statut.
   * @returns Un Observable contenant le statut mis à jour.
   */
  updateStatus(id: number, status: Partial<Status>): Observable<Status> {
    this.loadingService.show();
    return this.http
      .put<Status>(`${this.apiUrl}/api/statuses/${id}`, status)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /**
   * Supprime un statut par son ID.
   * @param id L'ID du statut à supprimer.
   * @returns Un Observable vide.
   */
  deleteStatus(id: number): Observable<void> {
    this.loadingService.show();
    return this.http
      .delete<void>(`${this.apiUrl}/api/statuses/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
