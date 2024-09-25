import { OrderService } from './../../services/order.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../../interfaces/Order';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private orderId: number | undefined;
  private oderSubscription: Subscription | undefined;

  public order: Order | undefined;
  ngOnInit(): void {

    this.orderId = this.route.snapshot.params['id'];
    this.getOrder();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.oderSubscription) {
      this.oderSubscription.unsubscribe();
    }
  }


  getOrder() {
    if (!this.orderId) {
      return;
    }
    this.oderSubscription = this.orderService.getOrder(this.orderId).subscribe({

      next: (response) => {
        this.order = response;
      },

      error: (err) => {
        console.error(err);
      }
    })

  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'cancelled':
        return 'badge-neutral';
      case 'delivered':
        return 'badge-accent';
      case 'pending':
        return 'badge-primary';
      case 'in transit':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  }
}
