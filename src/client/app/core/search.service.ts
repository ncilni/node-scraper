import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SearchService {
  constructor(
      private http: Http
  ) { }

  // SearchRequest(query):Observable<any> {
  //   return this.http.get('/api/search/?location='+query.location+'&industry='+query.industry+'&directory='+query.directory)
  //     // .map((res: Response) => res.json());
  //     .toPromise()
  //     .catch(this.handleError);
  // }
  Search(query):Observable<any>{
    return this.http.get('/api/search/?location='+query.location+'&industry='+query.industry+'&directory='+query.directory)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
