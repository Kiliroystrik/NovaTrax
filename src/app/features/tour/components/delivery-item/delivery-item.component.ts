import { Component, Input } from '@angular/core';
import { Delivery } from '../../../delivery/interfaces/Delivery';
import { Product } from '../../../product/interfaces/product';
import { LiquidProduct } from '../../../product/interfaces/LiquidProduct';
import { SolidProduct } from '../../../product/interfaces/SolidProduct';
import { CommonModule, DatePipe } from '@angular/common';
import { StatusColorPipe } from '../../../../shared/pipes/status-colors/status-color.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-colors/status-label.pipe';

@Component({
  selector: 'app-delivery-item',
  standalone: true,
  imports: [DatePipe, CommonModule, StatusColorPipe, StatusLabelPipe],
  templateUrl: './delivery-item.component.html',
  styleUrl: './delivery-item.component.scss',
})
export class DeliveryItemComponent {
  @Input() delivery!: Delivery;
  @Input() getStatusColor!: (status: string) => string;

  hasLiquidProducts: boolean = false;
  hasSolidProducts: boolean = false;

  ngOnInit(): void {
    this.hasLiquidProducts = this.delivery.productDeliveries.some((pd) =>
      this.isLiquidProduct(pd.product)
    );
    this.hasSolidProducts = this.delivery.productDeliveries.some((pd) =>
      this.isSolidProduct(pd.product)
    );
  }

  isLiquidProduct(product: Product): product is LiquidProduct {
    return product.type === 'liquid';
  }

  isSolidProduct(product: Product): product is SolidProduct {
    return product.type === 'solid';
  }

  constructor() {}
}
