import { TestBed } from '@angular/core/testing';

import { NgxRequestCacheService } from './ngx-request-cache.service';

describe('NgxRequestCacheService', () => {
  let service: NgxRequestCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRequestCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
