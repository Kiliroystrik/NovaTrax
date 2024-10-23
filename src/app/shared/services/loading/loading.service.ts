import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Observable pour suivre l'état du chargement
  get loading$() {
    return this._loading.asObservable();
  }

  // Activer le chargement
  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
