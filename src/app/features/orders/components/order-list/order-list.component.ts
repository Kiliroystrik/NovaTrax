import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { StatusColorPipe } from '../../../../shared/pipes/status-colors/status-color.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-colors/status-label.pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    OrderFormComponent,
    DeleteConfirmationModalComponent,
    StatusColorPipe,
    StatusLabelPipe,
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  orderToDelete: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService
      .getOrders(this.currentPage, this.limit)
      .subscribe((response) => {
        this.orders = response.items;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      });
  }

  getPagesAroundCurrent(): number[] {
    const range = 2;
    const pages: number[] = [];

    if (this.totalPages <= 1) {
      return pages;
    }

    for (
      let i = Math.max(2, this.currentPage - range);
      i <= Math.min(this.totalPages - 1, this.currentPage + range);
      i++
    ) {
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

  /***Partie Modal de création d'order ****/
  openModal() {
    const dialog: any = document.getElementById('orderCreationModal');
    dialog?.showModal();
  }

  closeModal() {
    const dialog: any = document.getElementById('orderCreationModal');
    dialog?.close();
  }

  onOrderFormSubmit(orderData: any) {
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.closeModal();
        this.fetchOrders();
        console.log('Commande creée avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande :', error);
      },
    });
  }

  /***Partie Modal de suppression d'order ****/
  // Ouvrir la modale de confirmation avec l'ID de la commande à supprimer
  openDeleteModal(orderId: number) {
    this.orderToDelete = orderId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  // Gérer la suppression confirmée
  onConfirmDelete(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.fetchOrders();
        console.log('Commande supprimée avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la commande :', error);
      },
    });
  }

  // Gérer l'annulation de la suppression
  onCancelDelete() {
    console.log('Suppression annulée');
  }
}
