import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MovieService } from './movie.service';
import { RequestCacheService } from 'projects/ngx-request-cache/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  movieList: any[];
  movieSelected: any;
  movieSelectedLoading = false;

  constructor(
    private movieService: MovieService,
    private requestCacheService: RequestCacheService,
  ) {
    this.onLoadMovies();
  }

  onChangeMovieSelected(movieId) {
    if (movieId !== '') {
      this.findMovieById(movieId);
    }
  }

  onLoadMovies() {
    this.movieSelected = null;
    this.listMovies();
  }

  onResetCache() {
    this.requestCacheService.clear();
  }

  private listMovies() {
    this.movieService.getAll(0)
      .subscribe((data) => {
        this.movieList = data.results;
      });
  }

  private findMovieById(id: number) {
    this.movieSelectedLoading = true;
    this.movieService.getOneById(id)
      .pipe(finalize(() => this.movieSelectedLoading = false))
      .subscribe((data) => {
        this.movieSelected = data;
      });
  }

}
