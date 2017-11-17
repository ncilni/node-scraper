import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { TestService } from './test.service';
import { SearchService } from './search.service';
import { UsersService } from './users.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: [TestService,
              SearchService,
              UsersService]
})
export class CoreModule {}
