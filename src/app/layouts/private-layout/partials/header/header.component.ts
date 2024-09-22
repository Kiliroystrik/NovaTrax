import { Component } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-private-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
