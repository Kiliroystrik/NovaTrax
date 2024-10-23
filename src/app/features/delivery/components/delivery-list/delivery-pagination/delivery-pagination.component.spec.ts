import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPaginationComponent } from './delivery-pagination.component';

describe('DeliveryPaginationComponent', () => {
  let component: DeliveryPaginationComponent;
  let fixture: ComponentFixture<DeliveryPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
