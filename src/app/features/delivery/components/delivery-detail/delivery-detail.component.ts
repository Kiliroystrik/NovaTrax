import { Component, OnInit } from '@angular/core';
import { Delivery } from '../../interfaces/Delivery';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DeliveryService } from '../../services/delivery-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './delivery-detail.component.html',
  styleUrl: './delivery-detail.component.scss',
})
export class DeliveryDetailComponent implements OnInit {
  delivery?: Delivery;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchDelivery();
  }

  fetchDelivery(): void {
    this.deliveryService.getDelivery(this.id).subscribe({
      next: (delivery: Delivery) => {
        this.delivery = delivery;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la livraison', error);
        // Afficher un message d'erreur à l'utilisateur
      },
    });
  }
}
