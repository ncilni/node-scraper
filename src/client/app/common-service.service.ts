import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs';
import { BASE_URL, Apicall } from './models/globalmodel';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class CommonServiceService {

  constructor(private http:Http) { }
  apitest(){
    return this.http.get(BASE_URL+Apicall.api).toPromise();
  }
  yelpSearch(query):Observable<any>{
    return this.http.post(BASE_URL+ Apicall.yelpSearch, query);
  }

  ypSearch(query):Observable<any>{
    return this.http.post(BASE_URL+ Apicall.ypSearch, query);
  }

  mantaSearch(query):Observable<any>{
    return this.http.post(BASE_URL+ Apicall.mantaSearch, query);
  }
  
}
