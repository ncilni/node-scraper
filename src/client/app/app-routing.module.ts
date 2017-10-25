import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ExporterComponent } from './components/exporter/exporter.component';



const appRoutes: Routes = [
    { path: 'history', component: SearchHistoryComponent },
    { path: 'result'  , component: SearchResultComponent },
    {
      path: 'search',
      component: SearchFormComponent
    },
    {
      path: 'export',
      component: ExporterComponent
    },
    { path: '',
      redirectTo: '/search',
      pathMatch: 'full'
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