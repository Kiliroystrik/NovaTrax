import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDeliveriesAssociationComponent } from './tour-deliveries-association.component';

describe('TourDeliveriesAssociationComponent', () => {
  let component: TourDeliveriesAssociationComponent;
  let fixture: ComponentFixture<TourDeliveriesAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourDeliveriesAssociationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDeliveriesAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
