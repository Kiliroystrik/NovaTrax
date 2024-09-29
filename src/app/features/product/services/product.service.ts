import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { finalize, Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getProducts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
    this.loadingService.show();
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<any>>(this.apiUrl + '/api/products', { params }).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getProduct(id: number): Observable<Product> {
    this.loadingService.show();
    return this.http.get<Product>(this.apiUrl + '/api/products/' + id).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  createProduct(product: Product): Observable<any> {
    this.loadingService.show();
    return this.http.post(this.apiUrl + '/api/products', product).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de mise à jour d'une commande
  updateProduct(id: number, product: Product): Observable<any> {
    this.loadingService.show();
    return this.http.put(this.apiUrl + `/api/products/${id}`, product).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patchProduct(id: number, partialProduct: Partial<Product>): Observable<any> {
    this.loadingService.show();
    return this.http.patch(this.apiUrl + `/api/products/${id}`, partialProduct).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  // Ajout de la méthode de suppression d'une commande
  deleteProduct(id: number): Observable<any> {
    this.loadingService.show();
    return this.http.delete(this.apiUrl + `/api/products/${id}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
