import { Order } from '../interfaces/orderList';
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
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/client/orders', { params }).pipe(
      finalize(() => this.loadingService.hide())
    )
  }
}