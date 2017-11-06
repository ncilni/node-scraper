import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class UsersService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
    
    createUser(query) {
        this.reqHeaders.append('Content-Type','application/json');
        return this.http.put('http://localhost:8020/api/users', JSON.stringify({ username: query.username, password: query.password, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});
    }
    editUser(query){
        this.reqHeaders.append('Content-Type','application/json');
        return this.http.post('http://localhost:8020/api/users', JSON.stringify({ username: query.username, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});    
    }
    deleteUser(userId){
        return this.http.delete('http://localhost:8020/api/users/?userId='+userId);
    }
    listUsers(query){
        return this.http.get('http://localhost:8020/api/users/?list=all');
    }
    getUser(userId){
        return this.http.get('http://localhost:8020/api/users/?list='+userId);
    }
}