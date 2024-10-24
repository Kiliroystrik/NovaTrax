import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-item.component.html',
  styleUrl: './delivery-item.component.scss',
})
export class DeliveryItemComponent {
  @Input() delivery: Delivery = {} as Delivery;
  @Input() isSelected: boolean = false;
  @Input() viewMode: 'table' | 'card' = 'table'; // Pour distinguer le mode d'affichage

  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteDelivery = new EventEmitter<number>();

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'badge-success text-white'; // Vert pour Delivered
      case 'In Transit':
        return 'badge-warning text-white'; // Jaune pour In Transit
      case 'Scheduled':
        return 'badge-primary text-white'; // Bleu pour Scheduled
      case 'Failed':
        return 'badge-error text-white'; // Rouge pour Failed
      case 'Pending':
        return 'badge-warning text-white'; // Jaune pour Pending
      default:
        return 'badge-neutral text-white'; // Gris pour les statuts non gérés
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'Pending':
        return 'En attente';
      case 'In Transit':
        return 'En transit';
      case 'Scheduled':
        return 'Programmé';
      case 'Failed':
        return 'Échoué';
      case 'Delivered':
        return 'Livrée';
      default:
        return 'Statut non reconnu';
    }
  }
}
