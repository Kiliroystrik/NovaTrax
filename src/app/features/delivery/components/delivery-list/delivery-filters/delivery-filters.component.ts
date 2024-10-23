import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delivery-filters',
  standalone: true,
  imports: [],
  templateUrl: './delivery-filters.component.html',
  styleUrl: './delivery-filters.component.scss',
})
export class DeliveryFiltersComponent {
  @Input() productTypes: string[] = [];
  @Input() postalCodes: string[] = [];
  @Input() statuses: string[] = [];

  @Output() filterChange = new EventEmitter<any>();

  selectedProductTypes: string[] = [];
  selectedPostalCodes: string[] = [];
  selectedStatuses: string[] = [];

  applyFilters() {
    this.filterChange.emit({
      productTypes: this.selectedProductTypes,
      postalCodes: this.selectedPostalCodes,
      statuses: this.selectedStatuses,
    });
  }

  toggleProductType(productType: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedProductTypes.push(productType);
    } else {
      this.selectedProductTypes = this.selectedProductTypes.filter(
        (type) => type !== productType
      );
    }
    this.applyFilters();
  }

  togglePostalCode(postalCode: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedPostalCodes.push(postalCode);
    } else {
      this.selectedPostalCodes = this.selectedPostalCodes.filter(
        (code) => code !== postalCode
      );
    }
    this.applyFilters();
  }

  toggleStatus(status: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    }
    this.applyFilters();
  }
}
