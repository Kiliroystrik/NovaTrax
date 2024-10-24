import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delivery-pagination',
  standalone: true,
  imports: [],
  templateUrl: './delivery-pagination.component.html',
  styleUrl: './delivery-pagination.component.scss',
})
export class DeliveryPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() changePage = new EventEmitter<number>();

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.changePage.emit(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage.emit(this.currentPage + 1);
    }
  }
}
