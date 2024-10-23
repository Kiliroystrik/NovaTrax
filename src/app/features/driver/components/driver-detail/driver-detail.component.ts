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
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../interfaces/driver';

@Component({
  selector: 'app-driver-detail',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './driver-detail.component.html',
  styleUrl: './driver-detail.component.scss',
})
export class DriverDetailComponent {
  // ----- Services et dépendances -----
  private route = inject(ActivatedRoute);
  private driverService = inject(DriverService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  // ----- Subscription -----
  private driverSubscription: Subscription | undefined;

  // ----- Données -----
  driverId: number | undefined;
  driverToDelete: number | null = null;
  public driver: Driver | undefined;
  public isModalOpen = false;

  // ----- Formulaire réactif -----
  public driverForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    licenseNumber: ['', [Validators.required]], // Sélecteur client obligatoire
  });

  // ----- Cycle de vie -----
  ngOnInit(): void {
    this.driverId = this.route.snapshot.params['id'];
    this.getDriver();
  }

  ngOnDestroy(): void {
    if (this.driverSubscription) {
      this.driverSubscription.unsubscribe();
    }
  }

  // ----- Gestion de la commande -----

  /** Récupération des détails de la commande */
  getDriver() {
    if (!this.driverId) return;

    this.driverSubscription = this.driverService
      .getDriver(this.driverId)
      .subscribe({
        next: (driver) => {
          this.driver = driver;

          this.driverForm.patchValue({
            firstName: driver.firstName,
            lastName: driver.lastName,
            licenseNumber: driver.licenseNumber, // Utiliser l'ID du client
          });
        },
        error: (err) => console.error(err),
      });
  }

  /** Mise à jour de la commande */
  onSubmit() {
    if (this.driverForm.invalid || !this.driverId) return;

    const driverUpdateData = this.driverForm.value as Partial<Driver>;

    this.driverService.patchDriver(this.driverId, driverUpdateData).subscribe({
      next: () => {
        this.getDriver(); // Rafraîchir la commande
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
  openDeleteModal(driverId: number) {
    this.driverToDelete = driverId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  /** Confirmation de la suppression */
  onConfirmDelete(driverId: number) {
    this.driverService.deleteDriver(driverId).subscribe({
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
