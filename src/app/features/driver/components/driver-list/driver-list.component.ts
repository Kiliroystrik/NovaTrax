import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DriverFormComponent } from '../driver-form/driver-form.component';
import { Driver } from '../../interfaces/driver';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    DeleteConfirmationModalComponent,
    DriverFormComponent,
  ],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss',
})
export class DriverListComponent {
  drivers: Driver[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  driverToDelete: number | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.driverService
      .getDrivers(this.currentPage, this.limit)
      .subscribe((response) => {
        this.drivers = response.items;
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
      this.fetchDrivers();
    }
  }

  /***Partie Modal de création d'driver ****/
  openModal() {
    const dialog: any = document.getElementById('driverCreationModal');
    dialog?.showModal();
  }

  closeModal() {
    const dialog: any = document.getElementById('driverCreationModal');
    dialog?.close();
  }

  onDriverFormSubmit(driverData: any) {
    this.driverService.createDriver(driverData).subscribe({
      next: () => {
        this.closeModal();
        this.fetchDrivers();
      },
      error: (error) => {
        console.error('Erreur lors de la création du conducteur :', error);
      },
    });
  }

  /***Partie Modal de suppression d'driver ****/
  // Ouvrir la modale de confirmation avec l'ID du conducteur à supprimer
  openDeleteModal(driverId: number) {
    this.driverToDelete = driverId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  // Gérer la suppression confirmée
  onConfirmDelete(driverId: number) {
    this.driverService.deleteDriver(driverId).subscribe({
      next: () => {
        this.fetchDrivers();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du conducteur :', error);
      },
    });
  }

  // Gérer l'annulation du suppression
  onCancelDelete() {}
}
