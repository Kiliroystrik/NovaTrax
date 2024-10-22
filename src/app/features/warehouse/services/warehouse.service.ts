import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { finalize, Observable } from 'rxjs';
import { Warehouse } from '../interfaces/warehouse';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getWarehouses(
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<PaginatedResponse<any>>(this.apiUrl + '/api/warehouses', { params })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getWarehouse(id: number): Observable<Warehouse> {
    this.loadingService.show();
    return this.http
      .get<Warehouse>(this.apiUrl + '/api/warehouses/' + id)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  createWarehouse(warehouse: Warehouse): Observable<any> {
    this.loadingService.show();
    return this.http
      .post(this.apiUrl + '/api/warehouses', warehouse)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Ajout de la méthode de mise à jour d'un entrepot
  updateWarehouse(id: number, warehouse: Warehouse): Observable<any> {
    this.loadingService.show();
    return this.http
      .put(this.apiUrl + `/api/warehouses/${id}`, warehouse)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  patchWarehouse(
    id: number,
    partialWarehouse: Partial<Warehouse>
  ): Observable<any> {
    this.loadingService.show();
    return this.http
      .patch(this.apiUrl + `/api/warehouses/${id}`, partialWarehouse)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // Ajout de la méthode de suppression d'un entrepot
  deleteWarehouse(id: number): Observable<any> {
    this.loadingService.show();
    return this.http
      .delete(this.apiUrl + `/api/warehouses/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
