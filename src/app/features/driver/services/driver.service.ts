import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { finalize, Observable } from 'rxjs';
import { Driver } from '../interfaces/driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getDrivers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/drivers', { params }).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getDriver(id: number): Observable<Driver> {
    this.loadingService.show();
    return this.http.get<Driver>(this.apiUrl + '/api/drivers/' + id).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  createDriver(driver: Driver): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/drivers', driver).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateDriver(id: number, driver: Driver): Observable<any> {
    this.loadingService.show();
    return this.http.put(this.apiUrl + `/api/drivers/${id}`, driver).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patchDriver(id: number, partialDriver: Partial<Driver>): Observable<any> {
    this.loadingService.show();
    return this.http.patch(this.apiUrl + `/api/drivers/${id}`, partialDriver).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de suppression d'une commande
  deleteDriver(id: number): Observable<any> {
    this.loadingService.show();
    return this.http.delete(this.apiUrl + `/api/drivers/${id}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
