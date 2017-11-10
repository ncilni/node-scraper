import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  message: any;
  
     constructor(private alertService: AlertService) { }
  
     ngOnInit() {
       
         this.alertService.getMessage().subscribe(message => { 
          this.message = message; 
          if(this.message != undefined){
          if(this.message.text.status == 500){
            this.message.text.statusText = " Internal Server Error.Please check network connection.";
          }
          else if(this.message.text.status == 401){
            this.message.text.statusText = " Not Authorized for this action.";
          }
          else if(this.message.text.status == 0){
            this.message.text.statusText = " ERR_CONNECTION_REFUSED";
          }
        }
          });
     }

}
