import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { finalize, Observable } from 'rxjs';
import { UnitOfMeasure } from '../interfaces/unit-of-measure';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getUnitOfMeasures(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/unit_of_measures', { params }).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getUnitOfMeasure(id: number): Observable<UnitOfMeasure> {
    this.loadingService.show();
    return this.http.get<UnitOfMeasure>(this.apiUrl + '/api/unit_of_measures/' + id).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  createUnitOfMeasure(order: UnitOfMeasure): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/unit_of_measures', order).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateUnitOfMeasure(id: number, order: UnitOfMeasure): Observable<any> {
    this.loadingService.show();
    return this.http.put(this.apiUrl + `/api/unit_of_measures/${id}`, order).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patchUnitOfMeasure(id: number, partialUnitOfMeasure: Partial<UnitOfMeasure>): Observable<any> {
    this.loadingService.show();
    return this.http.patch(this.apiUrl + `/api/unit_of_measures/${id}`, partialUnitOfMeasure).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de suppression d'une commande
  deleteUnitOfMeasure(id: number): Observable<any> {
    this.loadingService.show();
    return this.http.delete(this.apiUrl + `/api/unit_of_measures/${id}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
