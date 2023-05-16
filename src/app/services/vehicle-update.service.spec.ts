import { TestBed } from '@angular/core/testing';

import { VehicleUpdateService } from './vehicle-update.service';

describe('VehicleUpdateService', () => {
  let service: VehicleUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
