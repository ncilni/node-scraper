// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AgmCoreModule } from '@agm/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { MainSkinComponent } from './skin/main-skin/main-skin.component';
import { AlertComponent } from "./components/_directives/alert/alert.component";
import { AdminPanelComponent } from "./components/admin-panel/admin-panel.component";
import { CsvService } from "angular2-json2csv";
import { Logger } from "angular2-logger/core";
import { AuthGuard } from "./_guards/auth.guard";
import { AuthenticationService } from "./core/auth.service";
import { AlertService } from "./core/alert.service";
import {FormControl,FormGroup} from '@angular/forms';
import { UsersService } from "./core/users.service";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import { httpFactory } from './core/factory/http.factory';


// @NgModule({
//   imports: [
//     CommonModule,
//     BsDropdownModule.forRoot(),
//     TooltipModule.forRoot(),
//     ModalModule.forRoot()
//   ]
// })
//export class AppBootstrapModule {}

export const AppBootstrapImports = [
  AppRoutingModule, NgxDatatableModule, AgmCoreModule.forRoot({
    apiKey: "AIzaSyBKJ4uoOaIJc53W4jBxUBZGBJQrCLk_hyo",
    libraries: ["places"],region:'US'     
  }),
  BrowserModule,
  Ng2SmartTableModule,
  BsDropdownModule.forRoot(),
  TooltipModule.forRoot(),
  ModalModule.forRoot(), FormsModule,
  ReactiveFormsModule,
  CoreModule ];

export const AppBootstrapDeclaration = [
  AppComponent,
  SearchResultComponent,
  SearchHistoryComponent,
  SearchFormComponent,
  PageNotFoundComponent,
  ExporterComponent,
  DataTableComponent,
  ResultCardComponent,
  LoginComponentComponent,
  MainSkinComponent,
  AlertComponent,
  AdminPanelComponent
]

export const AppProviders = [
  CsvService, Logger,AuthGuard,AuthenticationService,AlertService, [{
    provide: Http,
    useFactory: httpFactory,
    deps: [XHRBackend, RequestOptions]
  }],
]