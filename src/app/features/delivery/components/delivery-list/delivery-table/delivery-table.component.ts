import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-table.component.html',
  styleUrl: './delivery-table.component.scss',
})
export class DeliveryTableComponent {
  @Input() deliveries: Delivery[] = [];
  @Input() selectedDeliveries: Delivery[] = [];

  @Output() deleteDelivery = new EventEmitter<number>();
  @Output() toggleSelection = new EventEmitter<number>();

  isSelected(id: number): boolean {
    return this.selectedDeliveries.some((delivery) => delivery.id === id);
  }

  onDeleteDelivery(id: number) {
    this.deleteDelivery.emit(id);
  }

  onToggleSelection(id: number) {
    this.toggleSelection.emit(id);
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
