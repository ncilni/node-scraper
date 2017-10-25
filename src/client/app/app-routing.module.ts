import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';
import { LoginComponentComponent } from './components/login-component/login-component.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponentComponent },
  { path: 'app', component:AppComponent , children:[
    { path: 'history', component: SearchHistoryComponent, outlet:'home' },
    { path: 'result'  , component: SearchResultComponent ,outlet:'home'},
    {
      path: 'search',
      component: SearchFormComponent,
      outlet:'home'
    },
    {
      path: 'export',
      component: ExporterComponent,
      outlet:'home'
    }]},
    { path: '',
      redirectTo: '/login',
      pathMatch: 'full',
    },
    { path: '**', component: PageNotFoundComponent }
  
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}