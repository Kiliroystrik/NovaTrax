import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../interfaces/tour';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { StatusColorPipe } from '../../../../shared/pipes/status-colors/status-color.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-colors/status-label.pipe';
import { Delivery } from '../../../delivery/interfaces/Delivery';

@Component({
  selector: 'app-tour-deliveries-association',
  standalone: true,
  imports: [DatePipe, StatusColorPipe, StatusLabelPipe],
  templateUrl: './tour-deliveries-association.component.html',
  styleUrl: './tour-deliveries-association.component.scss',
})
export class TourDeliveriesAssociationComponent implements OnInit {
  @Input() selectedDeliveries: Delivery[] = [];
  @Output() closeModal = new EventEmitter<void>();
  // liste de tournées
  tours: Tour[] = [];
  filteredToursList: Tour[] = [];

  statusOptions: string[] = [
    'Planned',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  searchTerm: string = '';
  selectedStatus: string = 'Planned'; // Statut par défaut

  isLoading = false;
  currentPage: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  selectedTour: Tour | null = null;

  // Référence à la section qui contient la table des tournées
  @ViewChild('tourList', { static: false }) tourList!: ElementRef;

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.fetchTours();
  }

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchTours(reset: boolean = false): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    if (reset) {
      this.tours = []; // Réinitialiser la liste si demandé (par exemple lors du changement de statut)
      this.currentPage = 1; // Réinitialiser la pagination
    }

    this.isLoading = true;
    this.tourService
      .getTours(this.currentPage, this.limit, this.selectedStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (reset) {
            this.tours = response.items; // Si on réinitialise, on remplace la liste
          } else {
            this.tours = [...this.tours, ...response.items]; // Sinon, on ajoute les nouveaux résultats
          }
          this.filteredToursList = this.tours;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des tournées', error);
          this.isLoading = false;
        },
      });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Typecast pour accéder à la valeur
    this.selectedStatus = target.value; // Mettre à jour le statut sélectionné
    this.tours = []; // Réinitialiser la liste des tournées
    this.currentPage = 1; // Réinitialiser la pagination
    this.fetchTours(); // Relancer la requête avec le nouveau statut
  }

  // Vérifier le défilement dans la section spécifique
  // Vérifier le défilement dans la section spécifique
  onScroll(): void {
    const element = this.tourList.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      !this.isLoading &&
      this.currentPage < this.totalPages
    ) {
      this.currentPage++;
      this.fetchTours();
    }
  }

  // TODO: Ecouter sur l'api pour filtrer les tournées
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const term = inputElement.value;

    this.searchTerm = term;
    this.filteredToursList = this.tours.filter(
      (tour) =>
        tour.tourNumber.includes(term) ||
        (tour.startDate && tour.startDate.toString().includes(term)) ||
        (tour.endDate && tour.endDate.toString().includes(term))
    );
  }

  selectTour(tour: Tour): void {
    this.tourService
      .getTour(tour.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.selectedTour = response;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la tournée', error);
        },
      });
  }

  filteredTours(): Tour[] {
    return this.filteredToursList;
  }

  assignToTour(): void {
    if (!this.selectedTour) {
      return;
    } else {
      this.tourService
        .patchTour(this.selectedTour.id, {
          deliveries: this.selectedDeliveries,
        })
        .subscribe({
          next: (response) => {
            console.log('Tournée mise à jour', response);
            this.closeModal.emit(); // Émettre l'événement pour fermer la modale après l'enregistrement
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de la tournée', error);
          },
          complete: () => {
            this.selectedTour = null;
          },
        });
    }
  }
}
