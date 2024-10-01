import { Component } from '@angular/core';
import { Vehicle } from '../../interfaces/vehicle';
import { VehicleService } from '../../services/vehicle.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [DatePipe, RouterLink, DeleteConfirmationModalComponent, VehicleFormComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {
  vehicles: Vehicle[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  vehicleToDelete: number | null = null;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.vehicleService.getVehicles(this.currentPage, this.limit).subscribe((response) => {
      this.vehicles = response.items;
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

    for (let i = Math.max(2, this.currentPage - range); i <= Math.min(this.totalPages - 1, this.currentPage + range); i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchVehicles();
    }
  }

  /***Partie Modal de création d'vehicle ****/
  openModal() {
    const dialog: any = document.getElementById('vehicleCreationModal');
    dialog?.showModal();
  }

  closeModal() {
    const dialog: any = document.getElementById('vehicleCreationModal');
    dialog?.close();
  }

  onVehicleFormSubmit(vehicleData: any) {
    this.vehicleService.createVehicle(vehicleData).subscribe({
      next: () => {
        this.closeModal();
        this.fetchVehicles();
        console.log('Véhicule créé avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la création du véhicule :', error);
      },
    });
  }

  /***Partie Modal de suppression d'vehicle ****/
  // Ouvrir la modale de confirmation avec l'ID du véhicule à supprimer
  openDeleteModal(vehicleId: number) {
    this.vehicleToDelete = vehicleId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  // Gérer la suppression confirmée
  onConfirmDelete(vehicleId: number) {
    this.vehicleService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.fetchVehicles();
        console.log('Véhicule supprimée avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du véhicule :', error);
      },
    });
  }

  // Gérer l'annulation du suppression
  onCancelDelete() {
    console.log('Suppression annulée');
  }
}
