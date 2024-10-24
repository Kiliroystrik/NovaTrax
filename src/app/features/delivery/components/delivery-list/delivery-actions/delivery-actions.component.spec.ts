import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryActionsComponent } from './delivery-actions.component';

describe('DeliveryActionsComponent', () => {
  let component: DeliveryActionsComponent;
  let fixture: ComponentFixture<DeliveryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
