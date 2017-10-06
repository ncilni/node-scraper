import { Component, OnInit, NgZone, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { } from 'googlemaps';
import { CommonServiceService } from '../../common-service.service';
import { SearchService } from '../../core/search.service';
@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent implements OnInit {
  public searchControl: FormControl;
  @ViewChild("searchtxt")
  public searchElementRef: ElementRef;
  isSelectedDirectory = 'Site Search';
  isSelectedIndustry = 'Industry';
  isSelectedLocation = '';
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
 location:any ={};
 data:any={};
 resp:any;
    // end of declarations

    constructor(private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,public ss:SearchService, public router:Router) { }

 ngOnInit() {  }
 

  searchList(query){
    var req = { "location": query,"industry": this.isSelectedIndustry, "directory": this.isSelectedDirectory};
    var re = /,/gi; 
    var loc = query.replace(re, ""); 
    console.log(req);
    this.router.navigate(['/result'],{ queryParams: { location: loc, industry: req.industry,  directory: req.directory, page: 1 } });
  }

  selectIndustry($event){
    console.log('option selected', this.isSelectedIndustry);
    this.ss.getLocation(this.isSelectedIndustry).subscribe(res=>
      {this.data=res.json()
      this.location=this.data.result;
      console.log('Data:',this.data);
      }
    )

  }

}
