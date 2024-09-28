import { Order } from '../interfaces/Order';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getOrders(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/orders', { params }).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getOrder(id: number): Observable<Order> {
    this.loadingService.show();
    return this.http.get<Order>(this.apiUrl + '/api/orders/' + id).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  createOrder(order: Order): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/orders', order).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateOrder(id: number, order: Order): Observable<any> {
    this.loadingService.show();
    return this.http.put(this.apiUrl + `/api/orders/${id}`, order).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patchOrder(id: number, partialOrder: Partial<Order>): Observable<any> {
    this.loadingService.show();
    return this.http.patch(this.apiUrl + `/api/orders/${id}`, partialOrder).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de suppression d'une commande
  deleteOrder(id: number): Observable<any> {
    this.loadingService.show();
    return this.http.delete(this.apiUrl + `/api/orders/${id}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
