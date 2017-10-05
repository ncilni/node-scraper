import { Component, OnInit, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { Router, ActivatedRoute, Params, ParamMap  } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { CommonServiceService } from '../../common-service.service';
import { SearchService } from '../../core/search.service';

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
   industries = [
    {id: 1, name: "Hotels"},
    {id: 2, name: "Real Estate"},
    {id: 3, name: "eCommerce"},
    {id: 4, name: "Beauty Products"},
    {id: 5, name: "Clothing"},
    {id: 6, name: "Niche Food Services"},
    {id: 7, name: "Coffee Shops"},
    {id: 8, name: "Wedding Cakes"},
    {id: 9, name: "Dentist"},
    {id: 10, name: "Car Dealerships"},
    {id: 11, name: "Lawyers"},
    {id: 12, name: "Jewellery Stores"},
    {id: 13, name: "HVAC"},
    {id: 14, name: "Landscaping"}
  ];
  directories = [
    {id: 1, name: "Yelp", value:'yelp'},
    {id: 2, name: "Yellow Pages", value:'yp'},
    {id: 3, name: "Manta", value:'manta'}
  ];
     // end of declarations



     constructor(public ss:SearchService, public route:ActivatedRoute, public router:Router) { 
       
      }
      goNextPage(){
        let current_page= this.route.snapshot.queryParams["page"];
        var target_page=+current_page + 1;
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
      
      this.Industry = this.route.snapshot.queryParams["industry"];
      let Loc = this.route.snapshot.queryParams["location"];
      let page = this.route.snapshot.queryParams["page"];
      var re = / United States/gi; 
      this.Location = Loc.replace(re, ""); 
      this.Directory = this.route.snapshot.queryParams["directory"];
      console.log(this.Industry, this.Location, this.Directory);
      this.query={industry:this.Industry, location: this.Location, directory: this.Directory, page:page};
      this.ss.Search(this.query).subscribe(res=>
        {this.resp=res.json()
          this.data=this.resp.result;
        console.log('Data:',this.resp);
        }
      )
        // this.ss.Search(this.query).subscribe(data => {
      //   // Read the result field from the JSON response.
      //   this.data = data['result'];
      //   console.log(this.data);

      // });
      
    }
  }
   