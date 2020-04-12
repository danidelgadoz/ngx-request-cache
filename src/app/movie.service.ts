import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { NGX_REQUEST_CACHABLE_HEADER } from 'projects/ngx-request-cache/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {
  }

  getAll(pageIndex: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('api_key', environment.movieDB.apiKey);
    params = params.append('page', String(pageIndex + 1));

    return this.http.get<any>(`${environment.movieDB.host}/movie/now_playing`, { params });
  }

  getOneById(id: number): Observable<any> {
    let params = new HttpParams();
    let headers = new HttpHeaders();
    params = params.append('api_key', environment.movieDB.apiKey);
    headers = headers.append(NGX_REQUEST_CACHABLE_HEADER, '');

    return this.http.get(`${environment.movieDB.host}/movie/${id}`, { headers, params });
  }

}
