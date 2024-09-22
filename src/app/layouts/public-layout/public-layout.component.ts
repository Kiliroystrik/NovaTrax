import { LoadingService } from './../../shared/services/loading/loading.service';
import { Component } from '@angular/core';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, LoadingComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
