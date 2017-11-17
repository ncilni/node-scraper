import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../core/users.service";
import { FormControl } from '@angular/forms';
import { User } from "../../modals/admin.modals";
import { AlertService } from '../../core/alert.service';
import { AuthenticationService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isActive = 'pills-home';
  isAuthorized = false;
  confirmPassword='';
  formValidity:boolean=true;
  userList = [];
  selectedUser = {
    "User_Id" : '',
    "firstname" :'',
    "lastname":'',
    "type":0,
    "username":''
  };
  newUser = {
    "firstname" :'',
    "lastname":'',
    "password":'',
    "type":0,
    "username":''
  };
  
  initialnewUser = {
    "firstname" :'',
    "lastname":'',
    "password":'',
    "type":0,
    "username":''
  };

  public UserSearchForm: FormControl;
  public UserRegistrationForm: FormControl;
  constructor(private userService:UsersService , private alertService: AlertService, private authenticationService: AuthenticationService, public router:Router) { 
  }

  onSelect(index){
    if(this.userList){
      this.selectedUser = this.userList[index];
    }
  }
  snackbar(err,type) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
    var classname = type + " show";
    // Add the "show" class to DIV
    x.className = classname;
    x.innerText = err;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace(classname, ""); }, 3000);
}

  getUserList(){
    let response = this.userService.getUser().subscribe(
      (users: any) => {
     users = users.json();
     this.userList = users.result;
     this.isAuthorized = true;
    },(err =>{
        let type = 'danger';
        this.snackbar(err,type);
        this.isAuthorized = false;
        this.alertService.error(err);
      })
    );
  }

  ngOnInit() {
    this.getUserList();
    this.UserSearchForm = new FormControl();
  }

  isEmpty(obj){
    if(obj.firstname.length > 0 || obj.lastname.length > 0 ||
      obj.username.length > 0 || obj.type || obj.User_Id.length > 0){
        return false;
      }else{
        return true;
      }
  }
  updateRecord(){
    if(this.isEmpty(this.selectedUser) == false){
    this.userService.editUser(this.selectedUser).subscribe((res) =>{
      this.getUserList();
    
    },err =>{
      this.snackbar(err,'danger');
      this.alertService.error(err);
    });
  }else{
    this.handleError();
    
  }

  }
  
  createUser(){
    console.log(this.newUser);
    if(this.isEmpty(this.newUser) == false){
    this.userService.createUser(this.newUser).subscribe((res) =>{ 
      this.getUserList();
      let response = res.json();
      console.log(response.status);
      this.newUser = this.initialnewUser;
      this.handleSuccess(response.status);
    },err =>{
      this.handleError();
    });
  }else{
    this.handleError();
  }
  }

  deleteRecord(){
    if(this.isEmpty(this.selectedUser) == false){
    this.userService.deleteUser(this.selectedUser.User_Id).subscribe(() => this.getUserList());
    }else{
      this.handleError();
    }
  }

  activefun(tab){
    this.isActive = tab; 
  }

  changeUserType(event){
    console.log(event);
    if(event.target.name == 'newRadios'){
      this.newUser.type = event.target.value;
    }else if(event.target.name == 'selectedRadios'){
      this.selectedUser.type = event.target.value;
    }
  }
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  handleError(){
    this.snackbar('Operation not allowed','danger');
  }
  handleSuccess(status){
    console.log(status);
    this.snackbar(status,'success');
  }
}
