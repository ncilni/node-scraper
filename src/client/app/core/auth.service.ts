import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
 
    login(uname: string, pword: string) {
        const headerDict = {
            'username': uname,
            'password': pword,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type'
          }

          const headerObj = {
              headers: new Headers(headerDict)
          };
          return this.http.get('http://localhost:8020/api/authenticate', headerObj)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
 
                return user;
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}