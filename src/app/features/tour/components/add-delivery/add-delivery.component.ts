import { Component, EventEmitter, Output } from '@angular/core';
import { AddDeliveryFormComponent } from '../add-delivery-form/add-delivery-form.component';

@Component({
  selector: 'app-add-delivery',
  standalone: true,
  imports: [AddDeliveryFormComponent],
  templateUrl: './add-delivery.component.html',
  styleUrl: './add-delivery.component.scss',
})
export class AddDeliveryComponent {
  @Output() addDelivery = new EventEmitter<void>();
  @Output() deliveryAdded = new EventEmitter<void>();
  showForm: boolean = false;

  constructor() {}

  onAdd() {
    this.showForm = true;
  }

  onFormAdded() {
    this.showForm = false;
    this.deliveryAdded.emit();
  }
}
