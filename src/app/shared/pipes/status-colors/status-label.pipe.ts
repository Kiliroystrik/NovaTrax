import { Pipe, PipeTransform } from '@angular/core';
import { StatusName } from '../../../features/status/enums/StatusName';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(statusName: string): string {
    switch (statusName) {
      // ClientOrder Statuses
      case 'Pending':
        return 'En attente';
      case 'Confirmed':
        return 'Confirmée';
      case 'Cancelled':
        return 'Annulée';
      case 'Completed':
        return 'Terminée';

      // Delivery Statuses
      case 'Scheduled':
        return 'Programmé';
      case 'In Transit':
        return 'En transit';
      case 'Delivered':
        return 'Livrée';
      case 'Failed':
        return 'Échoué';

      // Tour Statuses
      case 'Planned':
        return 'Planifiée';
      case 'In Progress':
        return 'En cours';
      // Reutiliser les statuts si nécessaires
      default:
        return 'Inconnu';
    }
  }
}
