import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

import { RequestCacheService } from './ngx-request-cache.service';
import { NGX_REQUEST_CACHABLE_HEADER } from './ngx-request-cache.constants';

@Injectable()
export class RequestCacheInterceptor implements HttpInterceptor {

  constructor(
    private requestCacheService: RequestCacheService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCachable(req)) {
      return next.handle(req);
    }

    req = this.removeCacheHeaders(req);
    const cachedResponse = this.requestCacheService.get(req);
    return cachedResponse ? cachedResponse : this.sendRequest(req, next);
  }

  private sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.requestCacheService.cast(req, event);
            this.requestCacheService.set(req, event);
          }
        }),
        catchError(error => {
          this.requestCacheService.cast(req, null, error);
          return throwError(error);
        }),
        finalize(() => {
          this.requestCacheService.complete(req);
        })
      );
  }

  private removeCacheHeaders(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ headers: req.headers.delete(NGX_REQUEST_CACHABLE_HEADER) });
  }

  private isCachable(req: HttpRequest<any>): boolean {
    return req.headers.has(NGX_REQUEST_CACHABLE_HEADER);
  }

}
