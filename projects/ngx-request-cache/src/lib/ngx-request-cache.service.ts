import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

// TODO: decouple private methods in other store.service
@Injectable()
export class RequestCacheService  {
  private cache = new Map<string, HttpResponse<any>>();
  private pending = new Map<string, Subject<HttpResponse<any>>>();

  constructor() {}

  private get(req: HttpRequest<any>): Observable<HttpResponse<any>> | undefined {
    const cached = this.cache.get(this.getKeyXHR(req));
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
    this.cache.set(this.getKeyXHR(req), this.deepCloneHttpResponse(res));
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
    this.cache.clear();
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
