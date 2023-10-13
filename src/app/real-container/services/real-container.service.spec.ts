import { TestBed } from '@angular/core/testing';

import { RealContainerService } from './real-container.service';

describe('RealContainerService', () => {
  let service: RealContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
