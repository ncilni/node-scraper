import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/auth.service';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) { }

  ngOnInit() {
      // reset login status
      let userdetails = localStorage.getItem('currentUser');
      if(!userdetails || userdetails == undefined || userdetails == null){
          this.authenticationService.logout();
    }
    else{
        this.router.navigateByUrl('/app/(home:search)');
    }
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
      this.loading = true;
      this.authenticationService.login(this.model.username, this.model.password)
          .subscribe(
              data => {
                  if(!this.returnUrl || !this.returnUrl==undefined){
                  this.router.navigate([this.returnUrl]);
                }
                else{
                    this.router.navigate(['/app']);
                }
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }
}
