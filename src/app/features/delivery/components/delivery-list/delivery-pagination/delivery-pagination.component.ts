import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delivery-pagination',
  standalone: true,
  imports: [],
  templateUrl: './delivery-pagination.component.html',
  styleUrl: './delivery-pagination.component.scss',
})
export class DeliveryPaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    this.pageChange.emit(page);
  }
}
