import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';
import { CommonModule } from '@angular/common';
import { DeliveryItemComponent } from '../delivery-item/delivery-item.component';

@Component({
  selector: 'app-delivery-card',
  standalone: true,
  imports: [CommonModule, DeliveryItemComponent],
  templateUrl: './delivery-card.component.html',
  styleUrl: './delivery-card.component.scss',
})
export class DeliveryCardComponent {
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

  onToggleSelectAll(): void {
    this.toggleSelectAll.emit();
  }
}
