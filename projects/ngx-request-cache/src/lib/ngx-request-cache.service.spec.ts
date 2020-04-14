import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { finalize } from 'rxjs/operators';
import { RequestCacheService } from './ngx-request-cache.service';

describe('RequestCacheService', () => {
  let service: RequestCacheService;
  const req = new HttpRequest('POST', '', {});

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RequestCacheService
      ]
    });

    service = TestBed.inject(RequestCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getKeyXHR', () => {
    it('should generate a unique key to identify requests', () => {
      expect((service as any).getKeyXHR(req)).toEqual(jasmine.any(String));
    });
  });

  describe('#get', () => {
    it('should return undefined if it\'s the first request', () => {
      expect(service.get(req)).toBeUndefined();
    });

    it('should return subject if there\'s an identical request pending', () => {
      service.get(req);
      expect(service.get(req).subscribe()).not.toBeUndefined();
    });

    it('should return data if there\'s an identical request cached', () => {
      service.set(req, new HttpResponse());
      expect(service.get(req)).not.toBeUndefined();
    });
  });

  describe('#set', () => {
    it('should storage a request in cache', () => {
      service.set(req, new HttpResponse());
      expect(service.get(req)).toBeDefined();
    });
  });

  describe('#cast', () => {
    it('should cast a success response for queque request', (done) => {
      const sucsessResponse = new HttpResponse();
      service.get(req);
      service.get(req).subscribe(data => {
        expect(data).toEqual(sucsessResponse);
        done();
      });
      service.cast(req, sucsessResponse);
    });

    it('should cast an error response for queque request', (done) => {
      const errorResponse = new HttpErrorResponse({});
      service.get(req);
      service.get(req).subscribe(null, error => {
        expect(error).toEqual(errorResponse);
        done();
      });
      service.cast(req, null, errorResponse);
    });
  });

  describe('#complete', () => {
    it('should cast finalize event for pendings request', (done) => {
      service.get(req);
      service.get(req).pipe(finalize(() => {
        expect();
        done();
      })).subscribe();
      service.complete(req);
    });

    it('should clear storage of pendings request', () => {
      service.get(req);
      service.get(req);
      service.complete(req);
      expect((service as any).pending.size).toEqual(0);
    });
  });

  describe('#clear', () => {
    it('should clear storage of pending and cache', () => {
      service.set(req, new HttpResponse());
      service.clear();
      expect(service.get(req)).toBeUndefined();
    });
  });

});
