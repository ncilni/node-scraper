import { NgModule } from '@angular/core';
import { AppBootstrapImports, AppBootstrapDeclaration, AppProviders } from './app-bootstrap-constants';
import { MainSkinComponent } from "./skin/main-skin/main-skin.component";



@NgModule({
  declarations: [
    ...AppBootstrapDeclaration,
  ],
  imports: [...AppBootstrapImports],
  providers: [...AppProviders],
  bootstrap: [MainSkinComponent]
})
export class AppModule { }
