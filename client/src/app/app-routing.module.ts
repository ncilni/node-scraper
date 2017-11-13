import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './_guards/auth.guard';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponentComponent },
  { path: 'admin-panel' , component: AdminPanelComponent},
  { path: 'app', component:AppComponent , canActivate:[AuthGuard], children:[
    { path: 'history', component: SearchHistoryComponent, canActivate:[AuthGuard] , outlet:'home' },
    { path: 'result/:loc/:industry/:page'  , component: SearchResultComponent, canActivate:[AuthGuard] ,outlet:'home'},
    
    {
      path: 'search',
      component: SearchFormComponent,
      outlet:'home',
      canActivate:[AuthGuard]
    },
    {
      path: 'export',
      component: ExporterComponent,
      outlet:'home',
      canActivate:[AuthGuard]
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