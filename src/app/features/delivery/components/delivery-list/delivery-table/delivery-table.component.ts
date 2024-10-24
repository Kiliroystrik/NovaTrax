import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';
import { DeliveryItemComponent } from '../delivery-item/delivery-item.component';

@Component({
  selector: 'app-delivery-table',
  standalone: true,
  imports: [DeliveryItemComponent],
  templateUrl: './delivery-table.component.html',
  styleUrl: './delivery-table.component.scss',
})
export class DeliveryTableComponent {
  @Input() deliveries: Delivery[] = [];
  @Input() selectedDeliveries: Delivery[] = [];

  @Output() toggleSelectAll = new EventEmitter<void>();
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteDelivery = new EventEmitter<number>();

  isSelected(id: number): boolean {
    return this.selectedDeliveries.some((d) => d.id === id);
  }

  isAllSelected(): boolean {
    return this.deliveries.every((delivery) => this.isSelected(delivery.id));
  }

  // Méthode pour basculer la sélection de toutes les livraisons
  onToggleSelectAll(): void {
    this.toggleSelectAll.emit();
  }
}
