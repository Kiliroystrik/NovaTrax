import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = new BehaviorSubject<boolean>(false);

  constructor() { }

  // Observable pour suivre l'état du chargement
  get loading$() {
    return this._loading.asObservable();
  }

  // Activer le chargement
  show() {
    console.log('Loader activated');
    this._loading.next(true);
  }

  hide() {
    console.log('Loader deactivated');
    this._loading.next(false);
  }
}
