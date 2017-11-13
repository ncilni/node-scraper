import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
@Injectable()
export class UsersService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
    
    createUser(query) {
        return this.http.post('/users', JSON.stringify({ username: query.username, password: query.password, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});
    }
    editUser(query){
        return this.http.put('/users', JSON.stringify({ userId:query.User_Id ,username: query.username, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});    
    }
    deleteUser(userId){
       return this.http.delete('/users/?userId='+userId);
    }
     
    getUser(){
      return  this.http.get('/users/?list=all');
    }
}