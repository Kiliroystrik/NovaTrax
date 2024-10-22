import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDeliveriesCreationComponent } from './tour-deliveries-creation.component';

describe('TourDeliveriesCreationComponent', () => {
  let component: TourDeliveriesCreationComponent;
  let fixture: ComponentFixture<TourDeliveriesCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourDeliveriesCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDeliveriesCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
