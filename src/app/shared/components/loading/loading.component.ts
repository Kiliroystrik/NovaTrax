import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  isLoading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    // Abonnement au service de chargement pour détecter les changements d'état
    this.loadingService.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }
}