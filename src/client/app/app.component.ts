import { Component } from '@angular/core';
import { TestService } from './core/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TestService]
})
export class AppComponent {
  title = 'app';
  testServerData;
  constructor(
      private testService: TestService,
  ) {}

  testServer() {
    this.testService.testRequest()
        .then(data => {
          this.testServerData = data._body;
          console.log('data', this.testServerData);
        })
        .catch(error => {
            this.testServerData = 'ERROR';
        })
  }
}
