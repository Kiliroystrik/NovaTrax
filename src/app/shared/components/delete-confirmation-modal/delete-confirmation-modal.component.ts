import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent {
  @Input() itemId: number | null = null; // ID de l'élément à supprimer
  @Input() message: string = 'Etes-vous sûr de vouloir supprimer cet élément ?'; // Message personnalisé
  @Output() confirmDelete = new EventEmitter<number>(); // Événement émis lors de la confirmation
  @Output() cancel = new EventEmitter<void>(); // Événement pour annuler la suppression

  // Ouvrir la modale
  openModal() {
    const dialog: any = document.getElementById('deleteConfirmationModal');
    dialog?.showModal();
  }

  // Fermer la modale
  closeModal() {
    const dialog: any = document.getElementById('deleteConfirmationModal');
    dialog?.close();
    this.cancel.emit(); // Émet un événement d'annulation
  }

  // Confirmation de la suppression
  onDeleteConfirmed() {
    if (this.itemId !== null) {
      this.confirmDelete.emit(this.itemId); // Émet l'ID de l'élément à supprimer
      this.closeModal();
    }
  }
}
