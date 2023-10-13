import { TestBed } from '@angular/core/testing';

import { LinkedListServiceService } from './linked-list-service.service';

describe('LinkedListServiceService', () => {
  let service: LinkedListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkedListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
