import { TestBed } from '@angular/core/testing';

import { ServAuthService } from './serv-auth.service';

describe('ServAuthService', () => {
  let service: ServAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
