import { NgModule } from '@angular/core';
import { AppBootstrapImports, AppBootstrapDeclaration, AppProviders } from './app-bootstrap-constants';
import { MainSkinComponent } from "./skin/main-skin/main-skin.component";
import { SnackbarComponent } from './components/_directives/snackbar/snackbar.component';



@NgModule({
  declarations: [
    ...AppBootstrapDeclaration,
    SnackbarComponent,

  ],
  imports: [...AppBootstrapImports],
  providers: [...AppProviders],
  bootstrap: [MainSkinComponent]
})
export class AppModule { }
