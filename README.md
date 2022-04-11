# NgxRequestCache

Cache for HTTP requests with Angular `HttpClient`.

**Common usages:**
* Avoid hitting server to fetch same data when service is invoked serially or in parallel.
* Create offline application.

*Library relies on ensure requests go through Angular `HttpInterceptor` (default behavior).*

## Demo
Check [live demo](https://ngx-request-cache.web.app) on your navigator **monitoring devtool's network** and take a look to the source on [StackBlitz](https://stackblitz.com/edit/ngx-request-cache-demo).

## Installation

```bash
npm i ngx-request-cache
```
## Usage

* **Setup root module:**

```javascript
import { NgxRequestCacheModule } from 'ngx-request-cache';

@NgModule({
  imports: [ NgxRequestCacheModule ]
})
```

By default, persistence is on memory. To switch to sessionStorage or localStorage, [review here](#other-setups).

* **Cache an API:**

```javascript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestCacheHeader } from 'ngx-request-cache';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append(RequestCacheHeader.Cachable, '');

    return this.http.get(`URL`, { headers });
  }
}
```
Library's headers are removed before sending the request to the server.

* **Clear cache:**

```javascript
import { RequestCacheService } from 'ngx-request-cache';

export class DataService {
  constructor(private requestCacheService: RequestCacheService) {
    this.requestCacheService.clear(); // All data stored.
  }
}
```

## Other setups

Cache store with persistence into <code>sessionStorage</code>:

```javascript
@NgModule({
  imports: [ 
    NgxRequestCacheModule.forRoot({ store: 'sessionStorage' })
  ]
})
```

Cache store with persistence into <code>localStorage</code>:

```javascript
@NgModule({
  imports: [ 
    NgxRequestCacheModule.forRoot({ store: 'localStorage' })
  ]
})
```

# How it works?
* If a request has `Cachable` header, then a cached response is returned. <ins>If there isn't a cached response</ins>, request is send to server and when the operation has completed the response is cached.
* A response is stored associating a unique ID generated from request method, url with params and body.
* <ins>Too Many Requests</ins> prevented: If 10 identical request are made at the same time, the first hits the server and the other 9 keep waiting for it's response to emit the response wherever they were invoked.
