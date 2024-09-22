import { LoadingService } from './../../shared/services/loading/loading.service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './partials/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingComponent],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.scss'
})
export class PrivateLayoutComponent {

  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // S'abonner au service pour suivre l'état de chargement
    this.loadingService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

}
