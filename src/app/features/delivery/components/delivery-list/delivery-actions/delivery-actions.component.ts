import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delivery-actions',
  standalone: true,
  imports: [],
  templateUrl: './delivery-actions.component.html',
  styleUrl: './delivery-actions.component.scss',
})
export class DeliveryActionsComponent {
  @Input() selectedDeliveriesCount: number = 0;

  @Output() assignToTour = new EventEmitter<void>();
  @Output() createTour = new EventEmitter<void>();

  // Méthode pour gérer l'assignation à une tournée
  onAssignToTour(): void {
    this.assignToTour.emit();
  }

  // Méthode pour gérer la création d'une nouvelle tournée
  onCreateTour(): void {
    this.createTour.emit();
  }
}
