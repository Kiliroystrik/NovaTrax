import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTableComponent } from './delivery-table.component';

describe('DeliveryTableComponent', () => {
  let component: DeliveryTableComponent;
  let fixture: ComponentFixture<DeliveryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
