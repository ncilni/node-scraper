import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../core/users.service";
import { FormControl } from '@angular/forms';
import { User } from "../../modals/admin.modals";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isActive = 'pills-home';
  userList = [];
  selectedUser = {
    "User_Id" : '',
    "firstname" :'',
    "lastname":'',
    "type":0,
    "username":''
  };
  public UserSearchForm: FormControl;
  constructor(private userService:UsersService) { 
    this.getUserList();
  }

  onSelect(index){
    if(this.userList){
      this.selectedUser = this.userList[index];
    }
  }

  getUserList(){
    this.userService.getUser().subscribe(res =>{
      let response = res.json();
      this.userList = response.result;
      console.log(this.userList);
   });
  }
  ngOnInit() {
    this.UserSearchForm = new FormControl();
  }

  updateRecord(){
    this.userService.editUser(this.selectedUser);
  }

  deleteRecord(){
    this.userService.deleteUser(this.selectedUser.User_Id);
  }

  activefun(tab){
    this.isActive = tab; 
  }

  changeUserType(typevalue){
    this.selectedUser['type'] = typevalue; 
  }
}
