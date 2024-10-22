import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Delivery } from '../../../delivery/interfaces/Delivery';
import { Product } from '../../../product/interfaces/product';
import { DeliveryItemComponent } from '../delivery-item/delivery-item.component';

@Component({
  selector: 'app-deliveries-list',
  standalone: true,
  imports: [ReactiveFormsModule, DeliveryItemComponent],
  templateUrl: './deliveries-list.component.html',
  styleUrl: './deliveries-list.component.scss',
})
export class DeliveriesListComponent {
  @Input() deliveries: Delivery[] = [];
  // @Input() getStatusColor!: (status: string) => string;
  @Input() isLiquidProduct!: (product: Product) => boolean;
  @Input() isSolidProduct!: (product: Product) => boolean;
  @Output() trackByDeliveryId = new EventEmitter<number>();
  @Output() trackByProductDeliveryId = new EventEmitter<number>();

  constructor() {}
}
