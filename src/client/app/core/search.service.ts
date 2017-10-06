import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SearchService {
  constructor(
      private http: Http
  ) { }



  getLocation(industry){
    return this.http.get('/api/history/location/?industry='+industry);
  }

  Search(query){
   return this.http.get('/api/search/?location='+query.location+'&industry='+query.industry+'&directory='+query.directory+'&page='+query.page);
    
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
