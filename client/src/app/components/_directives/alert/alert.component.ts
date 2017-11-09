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
          console.log(message.text);
          this.message = message; 
          if(this.message.text.status == 500){
            this.message.text.statusText += ". Please check network connection.";
          }
          else if(this.message.text.status == 401){
            this.message.text.statusText += ". Not Authorized for this action."
          }

          });
     }

}
