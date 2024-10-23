import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../client/services/client.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DatePipe } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../interfaces/vehicle';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.scss',
})
export class VehicleDetailComponent {
  // ----- Services et dépendances -----
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  // ----- Subscription -----
  private vehicleSubscription: Subscription | undefined;

  // ----- Données -----
  vehicleId: number | undefined;
  vehicleToDelete: number | null = null;
  public vehicle: Vehicle | undefined;
  public isModalOpen = false;

  // ----- Formulaire réactif -----
  public vehicleForm = this.formBuilder.group({
    licensePlate: ['', [Validators.required]],
    type: ['', [Validators.required]],
    model: ['', [Validators.required]],
    capacity: ['', [Validators.required]],
  });

  // ----- Cycle de vie -----
  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.params['id'];
    this.getVehicle();
  }

  ngOnDestroy(): void {
    if (this.vehicleSubscription) {
      this.vehicleSubscription.unsubscribe();
    }
  }

  // ----- Gestion de la commande -----

  /** Récupération des détails de la commande */
  getVehicle() {
    if (!this.vehicleId) return;

    this.vehicleSubscription = this.vehicleService
      .getVehicle(this.vehicleId)
      .subscribe({
        next: (vehicle) => {
          this.vehicle = vehicle;

          this.vehicleForm.patchValue({
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
          });
        },
        error: (err) => console.error(err),
      });
  }

  /** Mise à jour de la commande */
  onSubmit() {
    if (this.vehicleForm.invalid || !this.vehicleId) return;

    const vehicleUpdateData = this.vehicleForm.value as Partial<Vehicle>;

    this.vehicleService
      .patchVehicle(this.vehicleId, vehicleUpdateData)
      .subscribe({
        next: () => {
          this.getVehicle(); // Rafraîchir la commande
          this.closeUpdateModal(); // Fermer la modale après la mise à jour
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la commande :', err);
        },
      });
  }

  // ----- Modale de mise à jour -----

  /** Ouvrir la modale de mise à jour */
  openUpdateModal() {
    this.isModalOpen = true; // Ouvre la modale de mise à jour
  }

  /** Fermer la modale de mise à jour */
  closeUpdateModal() {
    this.isModalOpen = false; // Ferme la modale
  }

  // ----- Gestion de la suppression -----

  /** Ouvrir la modale de suppression */
  openDeleteModal(vehicleId: number) {
    this.vehicleToDelete = vehicleId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  /** Confirmation de la suppression */
  onConfirmDelete(vehicleId: number) {
    this.vehicleService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.router.navigate(['/conducteurs']); // Redirection après suppression
      },
      error: (error) =>
        console.error('Erreur lors de la suppression de la commande :', error),
    });
  }

  /** Annulation de la suppression */
  onCancelDelete() {}
}
