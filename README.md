# NgxRequestCache

HttpResponse stored on navigator memory to avoid hitting multiple times to the same API.

This implementation relies on:
1. Use of angular `HttpClient` service when request an API.
1. Developer ensures the requests go through `HttpInterceptor` (HttpClient default behavior).

## Features

* HttpResponse are stored associating to them a unique identifier generated with request URL with params and request body.
* <ins>Too Many Requests</ins> considered, so if you do 10 identical request at the same time the first is going to hit the API and the other 9 are going to wait for its response to emit the response where each of them were invocated.
* Ensures all requests with cache strategy has the same behavior as if it was used without cache strategy.

## Installation

```bash
npm i ngx-request-cache
```
## Usage

#### Before start using add providers and the interceptor at your root module:

```javascript
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestCacheInterceptor, RequestCacheService } from 'ngx-request-cache';

@NgModule({
  ...
  imports: [ HttpClientModule ],
  providers: [
    RequestCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestCacheInterceptor, multi: true },
  ]
})
```

#### Ready to go:

Add `NGX_REQUEST_CACHABLE_HEADER` on request header (will be remove before navigator do the XHR)

```javascript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NGX_REQUEST_CACHABLE_HEADER } from 'ngx-request-cache';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append(NGX_REQUEST_CACHABLE_HEADER, '');

    return this.http.get(`URL`, { headers, params });
  }
}
```

#### Clear cache:

Use `clear` method of `RequestCacheService` to remove **all data** stored in memory

```javascript
import { RequestCacheService } from 'ngx-request-cache';

export class DataService {
  constructor(private requestCacheService: RequestCacheService) {
    this.requestCacheService.clear(); // this is all
  }
}
```
