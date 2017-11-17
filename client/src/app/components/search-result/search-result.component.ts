import { Component, OnInit, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { Router, ActivatedRoute, Params, ParamMap  } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../core/search.service';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
   // declarations   
   public searchControl: FormControl;
   @ViewChild("searchtxt")
   public searchElementRef: ElementRef;
    Directory = '';
    Industry = '';
    Location = '';
    data:any={};
    resp:any;
    query={};


  settings = {
    columns: {
      business_name: {
        title: 'Business Name'
      },
      address: {
        title: 'Address'
      },
      phone: {
        title: 'Phone'
      },
      website: {
        title: 'Website'
      }
    }
  };
  private sub: any;
  page:number;
     // end of declarations



     constructor(
       public searchService:SearchService, 
       public route:ActivatedRoute, 
       public router:Router,
       public alertservice:AlertService) { 
        
      }
      goNextPage(){
        this.page= this.route.snapshot.queryParams["page"];
        var target_page=+this.page + 1;
        let loc = this.route.snapshot.queryParams["location"];
        let industry = this.route.snapshot.queryParams["industry"];
        let directory = this.route.snapshot.queryParams["directory"];
        this.router.navigate(['/result'],{ queryParams: { location: loc, industry: industry,  directory: directory, page: target_page } });
      }
      goPreviousPage(){
        let current_page= this.route.snapshot.queryParams["page"];
        var target_page=+current_page - 1;
        let loc = this.route.snapshot.queryParams["location"];
        let industry = this.route.snapshot.queryParams["industry"];
        let directory = this.route.snapshot.queryParams["directory"];
        this.router.navigate(['/result'],{ queryParams: { location: loc, industry: industry,  directory: directory, page: target_page } });
      }

     

      ngOnInit() {
        this.Industry = this.route.snapshot.params.industry;
        let Loc = this.route.snapshot.params.loc
        let npage = this.route.snapshot.params.page
        var re = / United States/gi; 
        this.Location = Loc.replace(re, ""); 
        this.query={industry:this.Industry, location: this.Location, page:npage};
        this.searchService.Search(this.query).subscribe(res=>
          {this.resp=res.json()
            this.data=this.resp.result;
          console.log('Data:',this.resp);
          }
        ),err =>{
          this.alertservice.error(err);
        }
      
    }
  }
   