import { TestBed } from '@angular/core/testing';

import { ServicesStatusColorService } from './services.status-color.service';

describe('ServicesStatusColorService', () => {
  let service: ServicesStatusColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesStatusColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
