import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
    
    login(username: string, password: string) {
        let passkey = window.btoa(password);
        this.reqHeaders.append('Content-Type','application/json');
        return this.http.post('http://localhost:8020/api/authenticate', JSON.stringify({ username: username, password: passkey }), {headers:this.reqHeaders})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                console.log(response.json());
                if (user) {
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