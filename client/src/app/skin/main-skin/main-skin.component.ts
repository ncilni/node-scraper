import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-skin',
  templateUrl: './main-skin.component.html',
  styleUrls: ['./main-skin.component.css']
})
export class MainSkinComponent implements OnInit {

  constructor(public route:Router) { }

  ngOnInit() {
  }

}
