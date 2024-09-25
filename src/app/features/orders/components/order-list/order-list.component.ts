import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders(this.currentPage, this.limit).subscribe((response) => {
      this.orders = response.items;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
      this.totalPages = response.totalPages;
    });
  }

  getPagesAroundCurrent(): number[] {
    const range = 2; // Nombre de pages à afficher autour de la page actuelle
    const pages: number[] = [];

    // Si il n'y a qu'une seule page ou seulement 2 pages, pas besoin de pagination
    if (this.totalPages <= 1) {
      return pages;
    }

    // Ajouter les pages autour de la page actuelle, sans inclure la première (1) ni la dernière page
    for (let i = Math.max(2, this.currentPage - range); i <= Math.min(this.totalPages - 1, this.currentPage + range); i++) {
      pages.push(i);
    }

    return pages;
  }





  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchOrders();
    }
  }
}
