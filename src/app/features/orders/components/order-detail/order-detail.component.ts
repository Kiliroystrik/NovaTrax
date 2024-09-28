import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { ClientService } from '../../../client/services/client.service';
import { Order } from '../../interfaces/Order';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [DatePipe]  // Ajout de DatePipe dans les providers
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  // ----- Services et dépendances -----
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  // ----- Subscription -----
  private orderSubscription: Subscription | undefined;

  // ----- Données -----
  public clientList: any[] = [];
  orderId: number | undefined;
  orderToDelete: number | null = null;
  public order: Order | undefined;
  public isModalOpen = false;

  // ----- Formulaire réactif -----
  public orderForm = this.formBuilder.group({
    status: ['', [Validators.required]],
    expectedDeliveryDate: [''],
    client: [0, [Validators.required]]  // Sélecteur client obligatoire
  });

  // ----- Cycle de vie -----
  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.getOrder();
    this.getClientList();  // Récupérer les clients pour le sélecteur
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  // ----- Gestion de la commande -----

  /** Récupération des détails de la commande */
  getOrder() {
    if (!this.orderId) return;

    this.orderSubscription = this.orderService.getOrder(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        const formattedDate = this.datePipe.transform(order.expectedDeliveryDate, 'yyyy-MM-dd');
        this.orderForm.patchValue({
          status: order.status,
          expectedDeliveryDate: formattedDate, // Utiliser la date formatée
          client: order.client.id  // Utiliser l'ID du client
        });
      },
      error: (err) => console.error(err),
    });
  }

  /** Récupération de la liste des clients */
  getClientList() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clientList = data.items;  // Charger la liste des clients
      },
      error: (err) => console.error(err),
    });
  }

  /** Mise à jour de la commande */
  onSubmit() {
    if (this.orderForm.invalid || !this.orderId) return;

    const orderUpdateData = this.orderForm.value as Partial<Order>;

    this.orderService.patchOrder(this.orderId, orderUpdateData).subscribe({
      next: () => {
        console.log('Commande mise à jour avec succès !');
        this.getOrder();  // Rafraîchir la commande
        this.closeUpdateModal();  // Fermer la modale après la mise à jour
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la commande :', err);
      }
    });
  }

  // ----- Modale de mise à jour -----

  /** Ouvrir la modale de mise à jour */
  openUpdateModal() {
    this.isModalOpen = true;  // Ouvre la modale de mise à jour
  }

  /** Fermer la modale de mise à jour */
  closeUpdateModal() {
    this.isModalOpen = false;  // Ferme la modale
  }

  // ----- Gestion de la suppression -----

  /** Ouvrir la modale de suppression */
  openDeleteModal(orderId: number) {
    this.orderToDelete = orderId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  /** Confirmation de la suppression */
  onConfirmDelete(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.router.navigate(['/commandes']);  // Redirection après suppression
        console.log('Commande supprimée avec succès !');
      },
      error: (error) => console.error('Erreur lors de la suppression de la commande :', error),
    });
  }

  /** Annulation de la suppression */
  onCancelDelete() {
    console.log('Suppression annulée');
  }

  // ----- Gestion des badges -----
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
