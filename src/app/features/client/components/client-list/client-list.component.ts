import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent {
  clients: any[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService
      .getClients(this.currentPage, this.limit)
      .subscribe((response) => {
        this.clients = response.items;
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
      this.fetchClients();
    }
  }

  /***Partie Modal de création d'order ****/

  // Ouvrir la modale de création d'une commande
  openModal() {
    const dialog: any = document.getElementById('orderCreationModal');

    dialog?.showModal(); // Ouvre la modale
  }

  // Fermer la modale
  closeModal() {
    const dialog: any = document.getElementById('orderCreationModal');
    dialog?.close(); // Ferme la modale
  }

  // Gérer la soumission du formulaire
  onOrderFormSubmit(orderData: any) {
    this.clientService.createClient(orderData).subscribe({
      next: () => {
        this.closeModal(); // Ferme la modale après soumission
        this.fetchClients();
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande :', error);
      },
    });
  }
}
