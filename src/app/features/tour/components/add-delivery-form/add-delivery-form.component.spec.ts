import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryFormComponent } from './add-delivery-form.component';

describe('AddDeliveryFormComponent', () => {
  let component: AddDeliveryFormComponent;
  let fixture: ComponentFixture<AddDeliveryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeliveryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliveryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
