import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { Client } from '../components/interfaces/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getClients(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/clients', { params }).pipe(
      finalize(() => this.loadingService.hide())
    )
  }

  getClient(id: number): Observable<Client> {
    this.loadingService.show();
    return this.http.get<Client>(this.apiUrl + '/api/clients/' + id).pipe(
      finalize(() => this.loadingService.hide())
    )
  }

  createClient(client: Client): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/clients', client).pipe(
      finalize(() => this.loadingService.hide())
    )
  }
}
