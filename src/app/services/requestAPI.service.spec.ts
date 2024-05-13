import { TestBed } from '@angular/core/testing';

import { RequestAPIService } from './requestAPI.service';

describe('RequestAPIService', () => {
  let service: RequestAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
