import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppBootstrapModule } from './app-bootstrap.module';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';
import { CommonServiceService } from "./common-service.service";


@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    SearchHistoryComponent,
    SearchFormComponent,
    PageNotFoundComponent,
    ExporterComponent
  ],
  imports: [
    AppRoutingModule, AgmCoreModule.forRoot({
      apiKey: "AIzaSyBKJ4uoOaIJc53W4jBxUBZGBJQrCLk_hyo",
      libraries: ["places"],region:'US'     
    }),
    BrowserModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [CommonServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
