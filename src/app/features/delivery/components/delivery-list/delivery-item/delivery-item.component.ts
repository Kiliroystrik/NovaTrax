import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-item',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterModule],
  templateUrl: './delivery-item.component.html',
  styleUrl: './delivery-item.component.scss',
})
export class DeliveryItemComponent {
  @Input() delivery!: Delivery;
  @Input() isSelected!: boolean;
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteDelivery = new EventEmitter<number>();

  onToggleSelection() {
    this.toggleSelection.emit(this.delivery.id);
  }

  onDeleteDelivery() {
    this.deleteDelivery.emit(this.delivery.id);
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'badge-success text-white';
      case 'In Transit':
        return 'badge-warning text-white';
      case 'Scheduled':
        return 'badge-primary text-white';
      case 'Failed':
        return 'badge-error text-white';
      default:
        return 'badge-neutral text-white';
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
        return 'Livré';
      default:
        return 'Status non reconnu';
    }
  }
}
