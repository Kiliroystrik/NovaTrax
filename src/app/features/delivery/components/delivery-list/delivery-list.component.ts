// src/app/features/delivery/components/delivery-list/delivery-list.component.ts

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Delivery } from '../../interfaces/Delivery';
import { DeliveryService } from '../../services/delivery-service';
import { PlannerComponent } from '../../../planner/components/planner/planner.component';
import { DeliveryFilterComponent } from './delivery-filter/delivery-filter.component';
import { DeliveryActionsComponent } from './delivery-actions/delivery-actions.component';
import { DeliveryTableComponent } from './delivery-table/delivery-table.component';
import { DeliveryCardComponent } from './delivery-card/delivery-card.component';
import { DeliveryPaginationComponent } from './delivery-pagination/delivery-pagination.component';
import { DeliveryItemComponent } from './delivery-item/delivery-item.component';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PlannerComponent,
    DeliveryFilterComponent,
    DeliveryActionsComponent,
    DeliveryTableComponent,
    DeliveryCardComponent,
    DeliveryPaginationComponent,
    DeliveryItemComponent,
  ],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
})
export class DeliveryListComponent implements OnInit, OnChanges {
  // ---------- Inputs and Outputs ----------

  // Liste des livraisons reçues depuis le parent
  @Input() deliveries: Delivery[] = [];

  // Événements émis pour informer le parent
  @Output() deliveryDeleted = new EventEmitter<number>(); // Pour notifier la suppression d'une livraison
  @Output() deliveriesSelected = new EventEmitter<number[]>(); // Pour notifier les livraisons sélectionnées
  @Output() assignToTour = new EventEmitter<number[]>(); // Pour assigner des livraisons à une tournée

  // ---------- Pagination and Selection ----------

  currentPage: number = 1; // Page courante pour la pagination
  itemsPerPage: number = 10; // Nombre d'éléments par page

  selectedDeliveries: Delivery[] = []; // Livraisons sélectionnées par l'utilisateur

  // ---------- Filtering ----------

  productTypes: string[] = []; // Liste des types de produits disponibles dans les livraisons
  selectedProductTypes: string[] = []; // Types de produits sélectionnés pour filtrer

  // Livraisons filtrées basées sur les filtres appliqués
  filteredDeliveries: Delivery[] = [];
  selectedPostalCodes: string[] = [];
  selectedStatuses: string[] = [];

  // Constructeur injectant les services
  constructor(private deliveryService: DeliveryService) {}

  // ---------- Lifecycle Hooks ----------

  ngOnInit(): void {}

  // Si les livraisons changent, on met à jour les filtres et la liste
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deliveries']) {
      this.getAllProductTypes(); // Mettre à jour la liste des types de produits
      this.applyFilter(); // Réappliquer les filtres
    }
  }

  /**
   * Méthode pour créer une nouvelle tournée avec les livraisons sélectionnées.
   */
  public onCreateTour(): void {
    if (this.selectedDeliveries.length > 0) {
      console.log(
        "Création d'une nouvelle tournée avec les livraisons:",
        this.selectedDeliveries.map((d) => d.id)
      );
      // Implémentez la logique pour créer une tournée ici
    } else {
      console.warn(
        'Aucune livraison sélectionnée pour la création de tournée.'
      );
    }
  }

  // Méthodes pour gérer les événements provenant du composant de filtre
  onSelectedProductTypesChange(selectedProductTypes: string[]): void {
    this.selectedProductTypes = selectedProductTypes;
    this.applyFilter();
  }

  onSelectedPostalCodesChange(selectedPostalCodes: string[]): void {
    this.selectedPostalCodes = selectedPostalCodes;
    this.applyFilter();
  }

  onSelectedStatusesChange(selectedStatuses: string[]): void {
    this.selectedStatuses = selectedStatuses;
    this.applyFilter();
  }

  // Les méthodes de suppression de filtres
  removePostalCode(postalCode: string): void {
    this.selectedPostalCodes = this.selectedPostalCodes.filter(
      (code) => code !== postalCode
    );
    this.applyFilter();
  }

  removeStatus(status: string): void {
    this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    this.applyFilter();
  }

  removeProductType(productType: string): void {
    this.selectedProductTypes = this.selectedProductTypes.filter(
      (type) => type !== productType
    );
    this.applyFilter();
  }

  // Méthode pour réinitialiser tous les filtres
  clearAllFilters(): void {
    this.selectedPostalCodes = [];
    this.selectedStatuses = [];
    this.selectedProductTypes = [];
    this.applyFilter();
  }

  // ---------- Filtering Methods ----------

  /**
   * Applique les filtres sélectionnés sur les livraisons.
   */
  applyFilter(): void {
    // Commencer avec toutes les livraisons
    this.filteredDeliveries = [...this.deliveries];

    // Filtrer par type de produit
    if (this.selectedProductTypes.length > 0) {
      this.filteredDeliveries = this.filteredDeliveries.filter((delivery) =>
        delivery.productDeliveries?.some((pd) =>
          this.selectedProductTypes.includes(pd.product.type)
        )
      );
    }

    // Filtrer par code postal
    if (this.selectedPostalCodes.length > 0) {
      this.filteredDeliveries = this.filteredDeliveries.filter((delivery) =>
        this.selectedPostalCodes.includes(delivery.geocodedAddress.postalCode)
      );
    }

    // Filtrer par statut
    if (this.selectedStatuses.length > 0) {
      this.filteredDeliveries = this.filteredDeliveries.filter((delivery) =>
        this.selectedStatuses.includes(delivery.status.name)
      );
    }

    // Réinitialiser la pagination après application des filtres
    this.currentPage = 1;
  }

  /**
   * Récupère tous les types de produits uniques à partir des livraisons.
   */
  getAllProductTypes(): void {
    if (this.deliveries && this.deliveries.length > 0) {
      const typesSet = new Set<string>();

      this.deliveries.forEach((delivery) => {
        if (delivery.productDeliveries) {
          delivery.productDeliveries.forEach((pd) => {
            if (pd.product?.type) {
              typesSet.add(pd.product.type);
            }
          });
        }
      });

      this.productTypes = Array.from(typesSet); // Met à jour les types de produits
    } else {
      this.productTypes = [];
    }
  }

  // ---------- Sorting Methods ----------

  /**
   * Trie les livraisons par code postal.
   */
  sortByPostalCode(): void {
    this.filteredDeliveries.sort((a, b) =>
      a.geocodedAddress.postalCode.localeCompare(b.geocodedAddress.postalCode)
    );
    this.currentPage = 1; // Réinitialise la pagination après tri
  }

  /**
   * Trie les livraisons par date de livraison.
   */
  sortByDeliveryDate(): void {
    this.filteredDeliveries.sort(
      (a, b) =>
        new Date(a.expectedDeliveryDate).getTime() -
        new Date(b.expectedDeliveryDate).getTime()
    );
    this.currentPage = 1; // Réinitialise la pagination après tri
  }

  // ---------- Selection Methods ----------

  /**
   * Vérifie si toutes les livraisons de la page courante sont sélectionnées.
   */
  isAllSelected(): boolean {
    const currentPageDeliveries = this.paginatedDeliveries;
    return currentPageDeliveries.every((delivery) =>
      this.isSelected(delivery.id)
    );
  }

  /**
   * Sélectionne ou désélectionne toutes les livraisons de la page courante.
   */
  toggleSelectAll(): void {
    const currentPageDeliveries = this.paginatedDeliveries;

    if (this.isAllSelected()) {
      // Si tout est sélectionné, on désélectionne
      currentPageDeliveries.forEach((delivery) => {
        this.selectedDeliveries = this.selectedDeliveries.filter(
          (d) => d.id !== delivery.id
        );
      });
    } else {
      // Sinon, on sélectionne toutes les livraisons de la page courante
      currentPageDeliveries.forEach((delivery) => {
        if (!this.isSelected(delivery.id)) {
          this.selectedDeliveries.push(delivery);
        }
      });
    }
    this.assignmentsUpdate(); // Met à jour l'état de sélection
  }

  /**
   * Vérifie si une livraison spécifique est sélectionnée.
   * @param id L'ID de la livraison.
   */
  isSelected(id: number): boolean {
    return this.selectedDeliveries.some((d) => d.id === id);
  }

  /**
   * Sélectionne ou désélectionne une livraison par son ID.
   * @param id L'ID de la livraison à sélectionner ou désélectionner.
   */
  toggleSelection(id: number): void {
    const index = this.selectedDeliveries.findIndex((d) => d.id === id);

    if (index > -1) {
      this.selectedDeliveries.splice(index, 1);
    } else {
      const delivery = this.deliveries.find((d) => d.id === id);
      if (delivery) {
        this.selectedDeliveries.push(delivery);
      }
    }
    this.assignmentsUpdate(); // Met à jour l'état de sélection
  }

  // ---------- Pagination Methods ----------

  /**
   * Récupère les livraisons paginées à afficher.
   */
  get paginatedDeliveries(): Delivery[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDeliveries.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  /**
   * Calcule le nombre total de pages pour la pagination.
   */
  get totalPages(): number {
    return Math.ceil(this.filteredDeliveries.length / this.itemsPerPage);
  }

  /**
   * Change la page courante.
   * @param page Le numéro de la page.
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ---------- CRUD Methods ----------

  /**
   * Supprime une livraison et met à jour la liste.
   * @param id L'ID de la livraison à supprimer.
   */
  deleteDelivery(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      this.deliveryService.deleteDelivery(id).subscribe({
        next: () => {
          this.deliveryDeleted.emit(id); // Notifie la suppression
          this.deliveries = this.deliveries.filter(
            (delivery) => delivery.id !== id
          );
          this.applyFilter(); // Réapplique les filtres après suppression
          this.selectedDeliveries = this.selectedDeliveries.filter(
            (d) => d.id !== id
          );
          this.assignmentsUpdate(); // Met à jour l'état de sélection
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la livraison', error);
        },
      });
    }
  }

  // ---------- Emit Events ----------

  /**
   * Met à jour la liste des livraisons sélectionnées et émet un événement.
   */
  assignmentsUpdate(): void {
    this.deliveriesSelected.emit(this.selectedDeliveries.map((d) => d.id));
  }

  /**
   * Émet les IDs des livraisons sélectionnées pour les assigner à une tournée.
   */
  public assignToTourMethod(): void {
    if (this.selectedDeliveries.length > 0) {
      console.log(
        'Assignation des livraisons:',
        this.selectedDeliveries.map((d) => d.id)
      );
      this.assignToTour.emit(this.selectedDeliveries.map((d) => d.id));
    } else {
      console.warn('Aucune livraison sélectionnée pour l’assignation.');
    }
  }
}
