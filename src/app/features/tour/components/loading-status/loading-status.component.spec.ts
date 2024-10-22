import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStatusComponent } from './loading-status.component';

describe('LoadingStatusComponent', () => {
  let component: LoadingStatusComponent;
  let fixture: ComponentFixture<LoadingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
