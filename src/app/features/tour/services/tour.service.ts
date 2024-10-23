import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { Tour } from '../interfaces/tour';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  // Modification de getTours pour accepter un paramètre de filtre 'status'
  getTours(
    page: number = 1,
    limit: number = 10,
    status?: string // Paramètre optionnel pour le statut
  ): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);

    // Ajouter le paramètre 'status' à la requête s'il est fourni
    if (status) {
      params = params.set('status', status);
    }

    return this.http
      .get<PaginatedResponse<any>>(this.apiUrl + '/api/tours', { params })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getTour(id: number): Observable<Tour> {
    this.loadingService.show();
    return this.http
      .get<Tour>(this.apiUrl + '/api/tours/' + id)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  createTour(tour: Tour): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(this.apiUrl + '/api/tours', tour)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  updateTour(id: number, tour: Tour): Observable<any> {
    this.loadingService.show();
    return this.http
      .put(this.apiUrl + `/api/tours/${id}`, tour)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  patchTour(id: number, partialTour: Partial<Tour>): Observable<any> {
    this.loadingService.show();
    return this.http
      .patch(this.apiUrl + `/api/tours/${id}`, partialTour)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  deleteTour(id: number): Observable<any> {
    this.loadingService.show();
    return this.http
      .delete(this.apiUrl + `/api/tours/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Méthodes spécifiques
  addDeliveriesToTour(
    tourId: number,
    deliveriesIds: number[]
  ): Observable<any> {
    const payload = { deliveriesIds }; // Prépare le tableau des IDs des livraisons
    return this.http
      .patch(this.apiUrl + `/api/tours/${tourId}/add-deliveries`, payload)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
