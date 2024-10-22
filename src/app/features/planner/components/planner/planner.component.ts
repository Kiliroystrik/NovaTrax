// src/app/features/planner/components/planner/planner.component.ts

import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // Import pour l'interaction
import { Delivery } from '../../../delivery/interfaces/Delivery';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Import du plugin timeGrid
import { DeliveryService } from '../../../delivery/services/delivery-service';
import { DeliveryListComponent } from '../../../delivery/components/delivery-list/delivery-list.component';
import { TourService } from '../../../tour/services/tour.service';
import { TourDeliveriesAssociationComponent } from '../../../tour/components/tour-deliveries-association/tour-deliveries-association.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    FullCalendarModule,
    DeliveryListComponent,
    TourDeliveriesAssociationComponent,
    FormsModule,
  ],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
})
export class PlannerComponent implements OnInit {
  // ---------- Variables & Inputs ----------

  deliveries: Delivery[] = []; // Liste des livraisons pour la période
  filteredDeliveries: Delivery[] = []; // Livraisons filtrées selon la date sélectionnée
  selectedDate: string | null = null; // Date sélectionnée dans le calendrier
  startOfPeriod: Date = new Date(); // Début de la période visible dans le calendrier
  endOfPeriod: Date = new Date(); // Fin de la période visible dans le calendrier
  selectedDeliveries: Delivery[] = []; // Livraisons sélectionnées pour être associées à une tournée
  allDayMode: boolean = true; // Nouveau paramètre utilisateur pour le mode All-Day

  // ---------- Options du calendrier ----------

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Plugins pour les vues
    initialView: 'dayGridMonth', // Vue par défaut
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    events: [], // Événements affichés dans le calendrier
    selectable: true, // Permet la sélection des dates et des heures
    unselectAuto: false, // Ne désélectionne pas automatiquement
    editable: false, // Désactive l'édition des événements
    dateClick: this.handleDateClick.bind(this), // Gestionnaire du clic sur une date (vue jour/mois)
    select: this.handleTimeGridSelect.bind(this), // Gestionnaire du clic sur une plage horaire (vue semaine)
    datesSet: this.handleDatesSet.bind(this), // Gestionnaire du changement de période visible
    eventClick: this.handleEventClick.bind(this), // Gestionnaire du clic sur un événement (livraison)
    timeZone: 'UTC', // TimeZone de la période visible dans le calendrier
    allDaySlot: true, // Active la case "All Day" pour la vue semaine
    slotMinTime: '00:00:00', // Début de l'affichage des heures
    slotMaxTime: '00:00:00', // Masque l'affichage des heures
  };

  // ---------- Constructeur et Injection des services ----------

  constructor(
    private deliveryService: DeliveryService,
    private tourService: TourService
  ) {}

  // ---------- Lifecycle Hooks ----------

  ngOnInit(): void {
    // Récupère les livraisons au chargement initial
    const today = new Date();
    this.fetchDeliveriesForView(today, today);
  }

  // ---------- Gestion des dates du calendrier ----------

  /**
   * Gère le changement de période visible dans le calendrier.
   * @param arg Les nouvelles dates visibles dans le calendrier.
   */
  handleDatesSet(arg: DatesSetArg): void {
    this.startOfPeriod = arg.start;
    this.endOfPeriod = arg.end;
    this.fetchDeliveriesForView(arg.start, arg.end);
  }

  /**
   * Gère le clic sur une date dans le calendrier.
   * @param arg Les détails de la date cliquée.
   */
  handleDateClick(arg: any): void {
    const clickedDate = arg.dateStr;

    if (this.selectedDate === clickedDate) {
      // Désélectionner la date manuellement avec la méthode unselect
      this.selectedDate = null;
      this.fetchDeliveriesForView(this.startOfPeriod, this.endOfPeriod);
    } else {
      // Sélectionner une nouvelle date
      this.selectedDate = clickedDate;
      this.updateDeliveriesList();
    }
  }

  /**
   * Gère la sélection d'une plage horaire dans la vue timeGrid (heure par heure).
   * @param arg Les détails de la plage horaire sélectionnée.
   */
  handleTimeGridSelect(arg: any): void {
    const startDate = arg.startStr; // Date et heure de début de la plage sélectionnée
    const endDate = arg.endStr; // Date et heure de fin de la plage sélectionnée

    // Filtrer les livraisons qui se trouvent dans cette plage horaire
    this.filteredDeliveries = this.deliveries.filter((delivery) => {
      const deliveryDate = new Date(
        delivery.expectedDeliveryDate
      ).toISOString();
      return deliveryDate >= startDate && deliveryDate < endDate;
    });
  }

  /**
   * Gère le clic sur un événement (livraison) dans le calendrier.
   * @param arg Les détails de l'événement cliqué.
   */
  handleEventClick(arg: any): void {
    const delivery: Delivery = arg.event.extendedProps.delivery;
  }

  // ---------- Gestion des livraisons et de la vue ----------

  /**
   * Récupère les livraisons pour la période visible dans le calendrier.
   * @param startDate La date de début de la période.
   * @param endDate La date de fin de la période.
   */
  fetchDeliveriesForView(startDate: Date, endDate: Date): void {
    const formattedStart = this.formatDate(startDate);
    const formattedEnd = this.formatDate(endDate);

    this.deliveryService
      .getDeliveries(1, 1000, formattedStart, formattedEnd)
      .subscribe({
        next: (response) => {
          this.deliveries = response.items;
          this.updateCalendarEvents(); // Met à jour les événements du calendrier
          this.updateDeliveriesList(); // Met à jour la liste des livraisons visibles en fonction du mode
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des livraisons', error);
        },
      });
  }

  /**
   * Met à jour les événements dans le calendrier en fonction des livraisons.
   */
  updateCalendarEvents(): void {
    // Regroupement des livraisons par jour
    const deliveriesByDay = this.groupDeliveriesByDay(this.deliveries);

    // Création des événements dans le calendrier pour chaque jour ou plage horaire
    const events = Object.keys(deliveriesByDay)
      .map((day) => {
        const deliveries = deliveriesByDay[day];

        // Si le mode "All-Day" est activé, toutes les livraisons seront affichées dans la section all-day
        if (this.allDayMode) {
          return {
            title: `${deliveries.length} livraison(s) en attente`,
            start: day, // Représente uniquement la date (sans heure)
            allDay: true, // Assigne l'événement à la case "all-day"
            extendedProps: { deliveries },
          };
        } else {
          // Sinon, les livraisons avec heures précises seront assignées aux plages horaires correspondantes
          return deliveries.map((delivery) => ({
            title: `ID: ${delivery.id} - ${delivery.status.name}`,
            start: new Date(delivery.expectedDeliveryDate).toISOString(),
            allDay: false, // Affichage dans les plages horaires
            extendedProps: { delivery },
          }));
        }
      })
      .flat();

    this.calendarOptions.events = events; // Mise à jour des événements dans le calendrier
  }

  /**
   * Gère le changement du mode "All-Day" dans le calendrier.
   */
  toggleAllDayMode(): void {
    this.updateCalendarEvents(); // Recalcule les événements en fonction du mode choisi
  }

  /**
   * Regroupe les livraisons par jour.
   * @param deliveries Liste des livraisons à regrouper.
   */
  groupDeliveriesByDay(deliveries: Delivery[]): Record<string, Delivery[]> {
    return deliveries.reduce(
      (acc: Record<string, Delivery[]>, delivery: Delivery) => {
        const deliveryDate = this.formatDate(
          new Date(delivery.expectedDeliveryDate)
        );
        if (!acc[deliveryDate]) {
          acc[deliveryDate] = [];
        }
        acc[deliveryDate].push(delivery);
        return acc;
      },
      {} as Record<string, Delivery[]>
    );
  }

  /**
   * Met à jour la liste des livraisons filtrées en fonction de la date sélectionnée.
   */
  updateDeliveriesList(): void {
    if (this.selectedDate) {
      // Filtre les livraisons en fonction de la date sélectionnée
      this.filteredDeliveries = this.deliveries.filter((delivery) => {
        const deliveryDate = this.formatDate(
          new Date(delivery.expectedDeliveryDate)
        );
        return deliveryDate === this.selectedDate;
      });
    } else if (!this.allDayMode) {
      // Si le mode "All-Day" est désactivé, afficher les livraisons sur toute la période visible
      this.filteredDeliveries = this.deliveries.filter((delivery) => {
        const deliveryDate = new Date(delivery.expectedDeliveryDate);
        return (
          deliveryDate >= this.startOfPeriod && deliveryDate <= this.endOfPeriod
        );
      });
    } else {
      // Si aucune date n'est sélectionnée, affiche toutes les livraisons
      this.filteredDeliveries = [...this.deliveries];
    }
  }

  // ---------- Gestion des suppressions de livraisons ----------

  /**
   * Gère la suppression d'une livraison.
   * @param deletedDeliveryId L'ID de la livraison supprimée.
   */
  onDeliveryDeleted(deletedDeliveryId: number): void {
    this.deliveries = this.deliveries.filter(
      (delivery) => delivery.id !== deletedDeliveryId
    );
    this.updateCalendarEvents(); // Met à jour les événements après suppression
    this.updateDeliveriesList(); // Met à jour la liste des livraisons
  }

  // ---------- Helpers ----------

  /**
   * Formate une date en chaîne de caractères (YYYY-MM-DD).
   * @param date La date à formater.
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // ---------- Gestion de la modale d'association de tournée ----------

  /**
   * Ouvre la modale d'association à une tournée.
   */
  openTourAssociationModal(): void {
    const dialog: any = document.getElementById('tourAssociationModal');
    dialog?.showModal();
  }

  /**
   * Ferme la modale d'association à une tournée.
   */
  closeTourAssociationModal(): void {
    const dialog: any = document.getElementById('tourAssociationModal');
    dialog?.close();
  }

  /**
   * Gère l'association des livraisons sélectionnées à une tournée.
   * @param deliveryIds Les IDs des livraisons sélectionnées.
   */
  onAssignToTour(deliveryIds: number[]): void {
    this.openTourAssociationModal();
  }
}