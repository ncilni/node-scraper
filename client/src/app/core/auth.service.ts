import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { development } from '../../environments/environment';
 
@Injectable()
export class AuthenticationService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
     API_URL = development.API_URL;   
    login(username: string, password: string) {
        
        this.reqHeaders.append('Content-Type','application/json');
        return this.http
          .post('/authenticate',
            JSON.stringify({ username: username, password: password }),
          )
          .map((response: Response) => {
            // login successful if there's a jwt token in the response
            console.log(response.json(), response.headers.get('authorization'));
            let user = response.headers.get('authorization');
            
            if (user) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('HashKey', JSON.stringify(user));
              localStorage.setItem('currentUser', JSON.stringify(username));
            }

            return user;
          })
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}