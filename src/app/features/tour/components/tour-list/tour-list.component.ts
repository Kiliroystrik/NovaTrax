import { Component } from '@angular/core';
import { Tour } from '../../interfaces/tour';
import { TourService } from '../../services/tour.service';
import { TourFormComponent } from '../tour-form/tour-form.component';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StatusColorPipe } from '../../../../shared/pipes/status-colors/status-color.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-colors/status-label.pipe';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [
    TourFormComponent,
    DeleteConfirmationModalComponent,
    RouterModule,
    DatePipe,
    StatusColorPipe,
    StatusLabelPipe,
  ],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.scss',
})
export class TourListComponent {
  tours: Tour[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  tourToDelete: number | null = null;

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.fetchTours();
  }

  fetchTours() {
    this.tourService
      .getTours(this.currentPage, this.limit)
      .subscribe((response) => {
        this.tours = response.items;
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
      this.fetchTours();
    }
  }

  /***Partie Modal de création d'tour ****/
  openModal() {
    const dialog: any = document.getElementById('tourCreationModal');
    dialog?.showModal();
  }

  closeModal() {
    const dialog: any = document.getElementById('tourCreationModal');
    dialog?.close();
  }

  onTourFormSubmit(tourData: any) {
    this.tourService.createTour(tourData).subscribe({
      next: () => {
        this.closeModal();
        this.fetchTours();
      },
      error: (error) => {
        console.error('Erreur lors de la création du tournée :', error);
      },
    });
  }

  /***Partie Modal de suppression d'tour ****/
  // Ouvrir la modale de confirmation avec l'ID du tournée à supprimer
  openDeleteModal(tourId: number) {
    this.tourToDelete = tourId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  // Gérer la suppression confirmée
  onConfirmDelete(tourId: number) {
    this.tourService.deleteTour(tourId).subscribe({
      next: () => {
        this.fetchTours();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du tournée :', error);
      },
    });
  }

  // Gérer l'annulation du suppression
  onCancelDelete() {}
}
