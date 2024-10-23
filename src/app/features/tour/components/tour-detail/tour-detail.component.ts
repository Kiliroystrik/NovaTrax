// src/app/features/tour/components/tour-detail/tour-detail.component.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { DriverService } from '../../../driver/services/driver.service';
import { VehicleService } from '../../../vehicle/services/vehicle.service';
import { WarehouseService } from '../../../warehouse/services/warehouse.service';
import { Warehouse } from '../../../warehouse/interfaces/warehouse';
import { Driver } from '../../../driver/interfaces/driver';
import { Vehicle } from '../../../vehicle/interfaces/vehicle';
import { Tour } from '../../interfaces/tour';
import { Delivery } from '../../../delivery/interfaces/Delivery';
import { ProductDelivery } from '../../../orders/interfaces/ProductDelivery';
import { LiquidProduct } from '../../../product/interfaces/LiquidProduct';
import { SolidProduct } from '../../../product/interfaces/SolidProduct';
import { Product } from '../../../product/interfaces/product';
import { StatusColorPipe } from '../../../../shared/pipes/status-colors/status-color.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-colors/status-label.pipe';
import { Status } from '../../../status/interfaces/status';
import { StatusService } from '../../../status/services/status.service';
@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [
    DeleteConfirmationModalComponent,
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    CommonModule,
    StatusColorPipe,
    StatusLabelPipe,
  ],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss'],
})
export class TourDetailComponent implements OnInit, OnDestroy {
  // ----- Services et dépendances -----
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private driverService = inject(DriverService);
  private vehicleService = inject(VehicleService);
  private statusService = inject(StatusService);

  // ----- Subject pour gérer les souscriptions -----
  private destroy$ = new Subject<void>();

  // ----- Données -----
  public warehouses: Warehouse[] = [];
  public drivers: Driver[] = [];
  public vehicles: Vehicle[] = [];
  public statuses: Status[] = [];
  tourToDelete: number | null = null;
  public isModalOpen = false;
  public isSubmitting = false;
  public error: string | null = null;
  private tourId!: number;

  public tour!: Tour;

  // ----- Propriétés pour le chargement total -----
  public totalWeight: number = 0;
  public totalVolume: number = 0;
  public weightPercentage: number = 0;
  public volumePercentage: number = 0;

  public vehicleWeight: number = 0;
  public vehicleVolume: number = 0;

  // ----- Formulaire réactif -----
  public tourForm: FormGroup = this.formBuilder.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: [null, [Validators.required]],
    loading: [null, [Validators.required]],
    vehicle: [null, [Validators.required]],
    driver: [null, [Validators.required]],
  });

  // ----- Boolean pour les boutons de modification -----
  public isEditing: boolean = false;
  public isCanceling: boolean = false;

  // ----- Variable pour stocker l'état initial du formulaire -----
  private initialFormValue: any;

  // ----- Cycle de vie -----
  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.params['id']);
    this.getTour();
    this.loadWarehouses();
    this.loadDrivers();
    this.loadVehicles();
    this.loadStatuses();

    this.tourForm.valueChanges.subscribe(() => {
      if (this.tourForm.touched || this.tourForm.dirty) {
        this.isEditing = true;
        this.isCanceling = true;
      }
    });
  }

  ngOnDestroy(): void {
    // Emettre une valeur pour terminer les souscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ----- Chargement des données -----

  /** Récupération des détails de la tournée */
  getTour() {
    if (!this.tourId) return;

    this.tourService
      .getTour(this.tourId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tour: Tour) => {
          this.tour = tour;

          const formValues = {
            startDate: this.formatDate(tour.startDate!),
            endDate: this.formatDate(tour.endDate!),
            status: tour.status!.id || null,
            loading: tour.loading!.id || null,
            vehicle: tour.vehicle!.id || null,
            driver: tour.driver!.id || null,
          };

          this.tourForm.patchValue(formValues);
          this.initialFormValue = { ...formValues }; // Stocker l'état initial

          this.vehicleWeight = Number(tour.vehicle!.weight) || 0;
          this.vehicleVolume = Number(tour.vehicle!.volume) * 1000 || 0; // Assuming volume is in cubic meters

          this.isCanceling = false;
          this.isEditing = false;
          this.calculateTotalLoading();
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Erreur lors de la récupération de la tournée.';
        },
      });
  }

  /** Formate la date pour le champ datetime-local */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().slice(0, 16);
  }

  /** Chargement des Warehouses */
  loadWarehouses() {
    this.warehouseService
      .getWarehouses(1, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.warehouses = data.items;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Erreur lors du chargement des warehouses.';
        },
      });
  }

  /** Chargement des Statuts */
  loadStatuses() {
    const statusType = 'Tour'; // Remplacez par le type approprié si nécessaire
    this.statusService
      .getStatusesByType(statusType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Status[]) => {
          this.statuses = data;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Erreur lors du chargement des statuts.';
        },
      });
  }

  /** Chargement des Conducteurs */
  loadDrivers() {
    this.driverService
      .getDrivers(1, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.drivers = data.items;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Erreur lors du chargement des conducteurs.';
        },
      });
  }

  /** Chargement des Véhicules */
  loadVehicles() {
    this.vehicleService
      .getVehicles(1, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vehicles = data.items;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Erreur lors du chargement des véhicules.';
        },
      });
  }

  /** Mise à jour de la tournée */
  onSubmit() {
    if (this.tourForm.invalid || !this.tourId) return;

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.tourForm.value;

    // Vérifier que les valeurs ne sont pas null ou undefined
    if (
      formValue.startDate &&
      formValue.endDate &&
      formValue.status &&
      formValue.loading &&
      formValue.vehicle
    ) {
      const tourUpdateData: Partial<Tour> = {
        startDate: new Date(formValue.startDate!).toISOString(),
        endDate: new Date(formValue.endDate!).toISOString(),
        status: formValue.status,
        loading: formValue.loading,
        vehicle: formValue.vehicle,
        driver: formValue.driver,
      };

      this.tourService
        .patchTour(this.tourId, tourUpdateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getTour(); // Rafraîchir les données
            this.isSubmitting = false;
            this.isEditing = false;
            this.isCanceling = false;
          },
          error: (err: any) => {
            console.error('Erreur lors de la mise à jour de la tournée :', err);
            this.error = 'Erreur lors de la mise à jour de la tournée.';
            this.isSubmitting = false;
          },
        });
    } else {
      this.error = 'Veuillez remplir tous les champs requis.';
      this.isSubmitting = false;
    }
  }

  /** Annuler la mise à jour */
  onCancelUpdate() {
    if (this.initialFormValue) {
      this.tourForm.reset(this.initialFormValue);
    }
    this.isEditing = false;
    this.isCanceling = false;
  }

  // ----- Gestion de la suppression -----

  /** Ouvrir la modal de suppression */
  openDeleteModal(tourId: number) {
    this.tourToDelete = tourId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  /** Confirmation de la suppression */
  onConfirmDelete(tourId: number) {
    this.tourService
      .deleteTour(tourId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/tournées']); // Redirection après suppression
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression de la tournée :', error);
          this.error = 'Erreur lors de la suppression de la tournée.';
        },
      });
  }

  /** Annulation de la suppression */
  onCancelDelete() {}

  /** Méthode TrackBy pour les Livraisons */
  trackByDeliveryId(index: number, delivery: Delivery): number {
    return delivery.id;
  }

  /** Méthode TrackBy pour les ProductDeliveries */
  trackByProductDeliveryId(
    index: number,
    productDelivery: ProductDelivery
  ): number {
    return productDelivery.id;
  }

  /** Méthode pour calculer le chargement total */
  calculateTotalLoading(): void {
    if (!this.tour || !this.tour.vehicle) {
      this.totalWeight = 0;
      this.totalVolume = 0;
      this.weightPercentage = 0;
      this.volumePercentage = 0;
      return;
    }

    let totalWeight = 0;
    let totalVolume = 0;

    this.tour.deliveries.forEach((delivery) => {
      if (delivery.status.name !== 'cancelled') {
        delivery.productDeliveries.forEach((productDelivery) => {
          const product = productDelivery.product;
          let volumePerUnit = 0;

          if (product.type === 'liquid') {
            const liquidProduct = product as LiquidProduct;
            volumePerUnit = liquidProduct.densityKgPerLiter
              ? liquidProduct.densityKgPerLiter * 1000 // Assuming L
              : 0;
          } else if (product.type === 'solid') {
            const solidProduct = product as SolidProduct;
            volumePerUnit =
              ((solidProduct.lengthCm || 0) *
                (solidProduct.widthCm || 0) *
                (solidProduct.heightCm || 0)) /
              1e6; // Convert cm³ to m³
          }

          const weightPerUnit = Number(product.weightKg) || 0;
          const quantity = Number(productDelivery.quantity) || 0;

          if (
            isFinite(weightPerUnit) &&
            isFinite(volumePerUnit) &&
            isFinite(quantity)
          ) {
            totalWeight += weightPerUnit * quantity;
            totalVolume += volumePerUnit * quantity;
          }
        });
      }
    });

    const vehicleWeightCapacity = this.vehicleWeight;
    const vehicleVolumeCapacity = this.vehicleVolume;

    const weightPercentage =
      vehicleWeightCapacity > 0
        ? (totalWeight / vehicleWeightCapacity) * 100
        : 0;
    const volumePercentage =
      vehicleVolumeCapacity > 0
        ? (totalVolume / vehicleVolumeCapacity) * 100
        : 0;

    this.weightPercentage = isFinite(weightPercentage) ? weightPercentage : 0;
    this.volumePercentage = isFinite(volumePercentage) ? volumePercentage : 0;

    this.totalWeight = totalWeight;
    this.totalVolume = totalVolume;
  }

  isLiquidProduct(product: Product): product is LiquidProduct {
    return (product as LiquidProduct).densityKgPerLiter !== undefined;
  }

  isSolidProduct(product: Product): product is SolidProduct {
    return (product as SolidProduct).lengthCm !== undefined;
  }

  // ----- Gestion des Ajouts de Livraison -----
  onAddDelivery() {
    // Implémenter la logique pour ajouter une livraison, par exemple ouvrir un formulaire
    // Vous pouvez ouvrir un modal ou naviguer vers un autre composant/formulaire
  }
}
