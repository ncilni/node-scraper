import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppBootstrapModule } from './app-bootstrap.module';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { DataTableModule } from 'angular-2-data-table';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CsvService } from "angular2-json2csv";



@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    SearchHistoryComponent,
    SearchFormComponent,
    PageNotFoundComponent,
    ExporterComponent,
    DataTableComponent,
    ResultCardComponent
  ],
  imports: [
    AppRoutingModule, NgxDatatableModule, AgmCoreModule.forRoot({
      apiKey: "AIzaSyBKJ4uoOaIJc53W4jBxUBZGBJQrCLk_hyo",
      libraries: ["places"],region:'US'     
    }),
    BrowserModule,
    Ng2SmartTableModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [CsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
