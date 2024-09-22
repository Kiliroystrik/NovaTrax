import { Registration } from './../interfaces/Registration';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  register(registration: Registration): Observable<any> {
    this.loadingService.show(); // Activer le loader
    return this.http.post(`${this.apiUrl}/api/register_company`, registration).pipe(
      finalize(() => this.loadingService.hide()) // Désactiver le loader à la fin de l'opération
    );
  }
}
