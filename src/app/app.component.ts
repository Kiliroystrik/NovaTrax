import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private loadingService: LoadingService) { }

  ngOnInit() {
    // Simple vérification de l'état de connexion, mais pas de redirection ici
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(this.isLoggedIn ? 'Utilisateur connecté' : 'Utilisateur non connecté');

    // S'abonner au service pour surveiller l'état de chargement
    this.loadingService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}
