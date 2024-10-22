import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { Delivery } from '../interfaces/Delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getDeliveries(
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Observable<PaginatedResponse<Delivery>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (startDate && endDate) {
      params = params.set('start', startDate).set('end', endDate);
    }

    return this.http
      .get<PaginatedResponse<Delivery>>(`${this.apiUrl}/api/deliveries`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des livraisons', error);
          return throwError(
            () => new Error('Erreur lors de la récupération des livraisons')
          );
        }),
        finalize(() => this.loadingService.hide())
      );
  }

  getDelivery(id: number): Observable<Delivery> {
    this.loadingService.show();
    return this.http.get<Delivery>(`${this.apiUrl}/api/deliveries/${id}`).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la récupération de la livraison avec l'ID ${id}`,
          error
        );
        return throwError(
          () => new Error('Erreur lors de la récupération de la livraison')
        );
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  createDelivery(delivery: Delivery): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(this.apiUrl + '/api/deliveries', delivery)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateDelivery(id: number, delivery: Delivery): Observable<any> {
    this.loadingService.show();
    return this.http
      .put(this.apiUrl + `/api/deliveries/${id}`, delivery)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  patchDelivery(
    id: number,
    partialDelivery: Partial<Delivery>
  ): Observable<any> {
    this.loadingService.show();
    return this.http
      .patch(this.apiUrl + `/api/deliveries/${id}`, partialDelivery)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Ajout de la méthode de suppression d'une commande
  deleteDelivery(id: number): Observable<any> {
    this.loadingService.show();
    return this.http
      .delete(this.apiUrl + `/api/deliveries/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
