import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { NgxRequestCacheMemoryStorage } from './storage/ngx-request-cache-memory-storage';

export interface NgxRequestCacheConfig {
  store?: any;
};

// TODO: decouple private methods in other store.service
@Injectable()
export class RequestCacheService  {
  private pending = new Map<string, Subject<HttpResponse<any>>>();
  private config: NgxRequestCacheConfig = {
    store: new NgxRequestCacheMemoryStorage(),
  };

  constructor() {}

  private get(req: HttpRequest<any>): Observable<HttpResponse<any>> | undefined {
    const cached = this.config.store.get(this.getKeyXHR(req));
    if (cached) {
      return of(this.deepCloneHttpResponse(cached));
    }

    const pending = this.pending.get(this.getKeyXHR(req));
    if (pending) {
      return pending.pipe(
        delay(1), // for paralell xhr response order, otherwise cached will cast before xhr... Is for style, it doesn't kill flow
        catchError(error => throwError(error))
      );
    }

    this.pending.set(this.getKeyXHR(req), new Subject<HttpResponse<any>>());

    return undefined;
  }

  private set(req: HttpRequest<any>, res: HttpResponse<any>): void {
    this.config.store.set(this.getKeyXHR(req), this.deepCloneHttpResponse(res));
  }

  private cast(req: HttpRequest<any>, res: HttpResponse<any> | null, error?: HttpErrorResponse): void {
      if (res) {
        this.pending.get(this.getKeyXHR(req))?.next(res);
      }

      if (error) {
        this.pending.get(this.getKeyXHR(req))?.error(error);
      }
  }

  private complete(req: HttpRequest<any>): void {
      this.pending.get(this.getKeyXHR(req))?.complete();
      this.pending.delete(this.getKeyXHR(req));
  }

  /**
   * Use clear method to remove all data stored in memory
   */
  clear(): void {
    this.config.store.clear();
  }

  private getKeyXHR(req: HttpRequest<any>): string {
    return `${req.urlWithParams}***${JSON.stringify(req.body)}`;
  }

  private deepCloneHttpResponse(res: HttpResponse<any>): any {
    return res.clone({
      body: JSON.parse(JSON.stringify(res.body))
    });
  }

}
