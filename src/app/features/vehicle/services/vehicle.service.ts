import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { finalize, Observable } from 'rxjs';
import { Vehicle } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getVehicles(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/vehicles', { params }).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getVehicle(id: number): Observable<Vehicle> {
    this.loadingService.show();
    return this.http.get<Vehicle>(this.apiUrl + '/api/vehicles/' + id).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  createVehicle(vehicle: Vehicle): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/vehicles', vehicle).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateVehicle(id: number, vehicle: Vehicle): Observable<any> {
    this.loadingService.show();
    return this.http.put(this.apiUrl + `/api/vehicles/${id}`, vehicle).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patchVehicle(id: number, partialVehicle: Partial<Vehicle>): Observable<any> {
    this.loadingService.show();
    return this.http.patch(this.apiUrl + `/api/vehicles/${id}`, partialVehicle).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de suppression d'une commande
  deleteVehicle(id: number): Observable<any> {
    this.loadingService.show();
    return this.http.delete(this.apiUrl + `/api/vehicles/${id}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
