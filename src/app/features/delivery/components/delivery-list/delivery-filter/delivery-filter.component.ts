import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../../../interfaces/Delivery';

@Component({
  selector: 'app-delivery-filter',
  standalone: true,
  imports: [],
  templateUrl: './delivery-filter.component.html',
  styleUrl: './delivery-filter.component.scss',
})
export class DeliveryFilterComponent {
  // Inputs provenant du composant parent
  @Input() deliveries: Delivery[] = [];
  @Input() productTypes: string[] = [];
  @Input() selectedProductTypes: string[] = [];
  @Input() selectedPostalCodes: string[] = [];
  @Input() selectedStatuses: string[] = [];

  // Événements émis vers le composant parent
  @Output() selectedProductTypesChange = new EventEmitter<string[]>();
  @Output() selectedPostalCodesChange = new EventEmitter<string[]>();
  @Output() selectedStatusesChange = new EventEmitter<string[]>();

  @Output() removePostalCode = new EventEmitter<string>();
  @Output() removeStatus = new EventEmitter<string>();
  @Output() removeProductType = new EventEmitter<string>();
  @Output() clearAllFilters = new EventEmitter<void>();

  @Output() sortByPostalCode = new EventEmitter<void>();
  @Output() sortByDeliveryDate = new EventEmitter<void>();

  // Méthodes pour gérer les filtres
  filterByProductType(productType: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedSelectedProductTypes = [...this.selectedProductTypes];

    if (isChecked) {
      if (!updatedSelectedProductTypes.includes(productType)) {
        updatedSelectedProductTypes.push(productType);
      }
    } else {
      const index = updatedSelectedProductTypes.indexOf(productType);
      if (index > -1) {
        updatedSelectedProductTypes.splice(index, 1);
      }
    }
    this.selectedProductTypesChange.emit(updatedSelectedProductTypes);
  }

  filterByPostalCode(postalCode: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedSelectedPostalCodes = [...this.selectedPostalCodes];

    if (isChecked) {
      if (!updatedSelectedPostalCodes.includes(postalCode)) {
        updatedSelectedPostalCodes.push(postalCode);
      }
    } else {
      const index = updatedSelectedPostalCodes.indexOf(postalCode);
      if (index > -1) {
        updatedSelectedPostalCodes.splice(index, 1);
      }
    }
    this.selectedPostalCodesChange.emit(updatedSelectedPostalCodes);
  }

  filterByStatus(status: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedSelectedStatuses = [...this.selectedStatuses];

    if (isChecked) {
      if (!updatedSelectedStatuses.includes(status)) {
        updatedSelectedStatuses.push(status);
      }
    } else {
      const index = updatedSelectedStatuses.indexOf(status);
      if (index > -1) {
        updatedSelectedStatuses.splice(index, 1);
      }
    }
    this.selectedStatusesChange.emit(updatedSelectedStatuses);
  }

  // Méthodes pour supprimer des filtres individuels
  onRemovePostalCode(postalCode: string): void {
    this.removePostalCode.emit(postalCode);
  }

  onRemoveStatus(status: string): void {
    this.removeStatus.emit(status);
  }

  onRemoveProductType(productType: string): void {
    this.removeProductType.emit(productType);
  }

  onClearAllFilters(): void {
    this.clearAllFilters.emit();
  }

  // Méthode pour traduire les statuts
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
