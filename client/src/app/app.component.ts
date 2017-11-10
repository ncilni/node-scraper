import { Component, TemplateRef, OnInit } from '@angular/core';
import { TestService } from './core/test.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './core/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TestService]
})
export class AppComponent implements OnInit {
  
    constructor(private authenticationService: AuthenticationService, public router:Router) { }
  
    ngOnInit() {
    }
    logout(){
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }

  }