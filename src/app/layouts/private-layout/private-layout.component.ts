import { LoadingService } from './../../shared/services/loading/loading.service';
import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './partials/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingComponent, RouterLink],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.scss',
})
export class PrivateLayoutComponent {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const drawerCheckbox: HTMLInputElement = document.getElementById(
          'my-drawer-2'
        ) as HTMLInputElement;
        if (drawerCheckbox && drawerCheckbox.checked) {
          drawerCheckbox.checked = false; // Fermer la sidebar
        }
      }
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // S'abonner au service pour suivre l'état de chargement
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
