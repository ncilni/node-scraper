import { Component, OnInit, NgZone, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { } from 'googlemaps';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
   // declarations 
  //  public rowData: EventEmitter<any> = new EventEmitter();
  //  public latitude: number;
  //  public longitude: number;
   public searchControl: FormControl;
   @ViewChild("searchtxt")
   public searchElementRef: ElementRef;
   isSelectedDirectory;
   isSelectedIndustry;
   isSelectedLocation;
    Validator:boolean=false;
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

     constructor(private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone, public router:Router) { }

  ngOnInit() {
    this.searchControl = new FormControl();
    //  this.setCurrentPosition();
     this.mapsAPILoader.load().then(() => {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
         types: ['(cities)'], componentRestrictions: {country: "us"},
       });
       
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
           
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
 
         });
       });
     });
   }
  
 
   searchList(query){
     console.log('query:', query, this.isSelectedDirectory, this.isSelectedIndustry);
     var req = { "location": query,"industry": this.isSelectedIndustry, "directory": this.isSelectedDirectory};
     var re = /,/gi; 
     var loc = query.replace(re, ""); 
     console.log(req);
     this.router.navigate(['/app', {outlets: {'home': ['result',loc,req.industry,1]}}]);
   }
  
   validcheck(value){
      return value === undefined ? true : false;
   }
 
  }

  