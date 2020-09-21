import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {BodyInterface, DaDataInterface, SuggestionInterface} from './dadata.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(private http: HttpClient) { }

  public url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  public httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Token c2535837b30e600730a7b14ebe09652a42a0f48b',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
  };

  getDaData(query: string = null): Observable<SuggestionInterface[]> {
    if (!query) { return of([]); }

    const body: BodyInterface  = {
      count: 6,
      query: query
    };

    return this.http.post(this.url, body, this.httpOptions)
      .pipe(
        map((data: DaDataInterface) => {
          return data.suggestions;
        })
      );
  }
}
