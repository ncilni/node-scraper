import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../core/users.service";
import { FormControl } from '@angular/forms';
import { User } from "../../modals/admin.modals";
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isActive = 'pills-home';
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

  public UserSearchForm: FormControl;
  public UserRegistrationForm: FormControl;
  constructor(private userService:UsersService , private alertService: AlertService) { 
    this.getUserList();
  }

  onSelect(index){
    if(this.userList){
      this.selectedUser = this.userList[index];
    }
  }

  getUserList(){
    let response = this.userService.getUser().subscribe(
      (users: any) => {
        users = users.json();
     this.userList = users.result;
      },(err =>{
        this.alertService.error(err);
      })
    );
  }

  ngOnInit() {
    this.UserSearchForm = new FormControl();
  }

  updateRecord(){
    this.userService.editUser(this.selectedUser).subscribe(() => this.getUserList());
  }
  
  createUser(){
    this.userService.createUser(this.newUser).subscribe(() => this.getUserList());
  }

  deleteRecord(){
    this.userService.deleteUser(this.selectedUser.User_Id).subscribe(() => this.getUserList());
  }

  activefun(tab){
    this.isActive = tab; 
  }

  changeUserType(typevalue){
    this.selectedUser['type'] = typevalue; 
  }
}
