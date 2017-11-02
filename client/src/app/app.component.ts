import { Component, TemplateRef, OnInit } from '@angular/core';
import { TestService } from './core/test.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TestService]
})
export class AppComponent implements OnInit {
  
    constructor() { }
  
    ngOnInit() {
    }
  
  }