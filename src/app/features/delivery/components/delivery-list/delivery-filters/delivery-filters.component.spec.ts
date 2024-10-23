import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFiltersComponent } from './delivery-filters.component';

describe('DeliveryFiltersComponent', () => {
  let component: DeliveryFiltersComponent;
  let fixture: ComponentFixture<DeliveryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
