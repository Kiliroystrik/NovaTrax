import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service'; // Assure-toi d'importer le bon chemin vers le service
import { By } from '@angular/platform-browser'; // Pour interagir avec le DOM dans les tests

// Mock OrderService
class MockOrderService {
  getOrders(page: number, limit: number) {
    return of({
      items: [
        { id: 1, orderNumber: 'ORD-12345', customerName: 'John Doe', orderDate: '2024-09-01T00:00:00', expectedDeliveryDate: '2024-09-15T00:00:00', status: 'pending' },
        { id: 2, orderNumber: 'ORD-67890', customerName: 'Jane Doe', orderDate: '2024-09-02T00:00:00', expectedDeliveryDate: '2024-09-16T00:00:00', status: 'delivered' }
      ],
      totalItems: 20,
      currentPage: 1,
      totalPages: 2
    });
  }
}

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let mockOrderService: MockOrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      providers: [
        { provide: OrderService, useClass: MockOrderService } // On remplace OrderService par MockOrderService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    mockOrderService = TestBed.inject(OrderService); // On injecte le mock service
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders on initialization', () => {
    // S'assurer que la méthode fetchOrders est bien appelée lors de l'initialisation
    const spyFetchOrders = spyOn(component, 'fetchOrders').and.callThrough();
    component.ngOnInit();
    expect(spyFetchOrders).toHaveBeenCalled();
  });

  it('should display orders in the table', () => {
    fixture.detectChanges(); // Permet de rafraîchir le DOM après modification des données

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2); // Il devrait y avoir 2 commandes affichées (car c'est ce que le mock retourne)

    const firstRow = rows[0].nativeElement;
    expect(firstRow.textContent).toContain('ORD-12345'); // Vérifier que la première commande est affichée
    expect(firstRow.textContent).toContain('John Doe');
    expect(firstRow.textContent).toContain('pending');
  });

  it('should display pagination buttons correctly', () => {
    fixture.detectChanges();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.btn-group .btn'));
    expect(paginationButtons.length).toBeGreaterThan(0); // Vérifier qu'il y a bien des boutons de pagination

    const firstPageButton = paginationButtons[0].nativeElement;
    expect(firstPageButton.textContent).toContain('1'); // Le premier bouton doit contenir '1'
  });

  it('should navigate to next page when clicking "Suivant"', () => {
    // Simuler un click sur le bouton "Suivant"
    const nextPageButton = fixture.debugElement.query(By.css('.btn-group .btn:last-child')).nativeElement;
    nextPageButton.click();

    fixture.detectChanges(); // Rafraîchir le DOM après le clic

    expect(component.currentPage).toBe(2); // Vérifier que la page courante est passée à 2
    // On pourrait aussi vérifier que fetchOrders a été appelée avec la nouvelle page
  });
});
