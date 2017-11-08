import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
const API_URL = 'http://localhost:8020/';
 
@Injectable()
export class UsersService {
    reqHeaders =  new Headers();
    constructor(private http: Http) { }
    
    createUser(query) {
        this.reqHeaders.append('Content-Type','application/json');
        return this.http.put(API_URL +'api/users', JSON.stringify({ username: query.username, password: query.password, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});
    }
    editUser(query){
        console.log("Update request for queries:", query, "url hitting:",API_URL+'api/users');
        this.reqHeaders.append('Content-Type','application/json');
        return this.http.post(API_URL +'api/users', JSON.stringify({ userId:query.User_Id ,username: query.username, firstname: query.firstname, lastname: query.lastname, type: query.type  }), {headers:this.reqHeaders});    
    }
    deleteUser(userId){
       this.reqHeaders.append('Content-Type','application/json'); 
       return this.http.delete(API_URL+'api/users/?userId='+userId);
    }
     
    getUser(){
      return  this.http.get('/users/?list=all') .subscribe(
        (users: any) => {
            users = users.json();
            console.log(users);
        });
    }
}