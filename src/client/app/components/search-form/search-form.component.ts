import { Component, OnInit, NgZone, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { CommonServiceService } from '../../common-service.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
   // declarations 
   public rowData: EventEmitter<any> = new EventEmitter();
   public latitude: number;
   public longitude: number;
   public searchControl: FormControl;
   @ViewChild("searchtxt")
   public searchElementRef: ElementRef;
   isSelectedDirectory = 'Site Search';
   isSelectedIndustry = 'Industry';
   industries = [
    {id: 1, name: "Hotels"},
    {id: 2, name: "Real Estate"},
    {id: 3, name: "eCommerce"},
    {id: 4, name: "Brazil"},
    {id: 5, name: "England"}
  ];
  directories = [
    {id: 1, name: "Yelp"},
    {id: 2, name: "Yellow Pages"},
    {id: 3, name: "Manta"}
  ];
     // end of declarations

     constructor(private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,public cms:CommonServiceService) { }

  ngOnInit() {
    this.searchControl = new FormControl();
     this.setCurrentPosition();
     this.mapsAPILoader.load().then(() => {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
         types: ['(cities)'], componentRestrictions: {country: "us"},
       });
       
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
           
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
           console.log(place);
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
 
           //set latitude, longitude
           this.latitude = place.geometry.location.lat();
           this.longitude = place.geometry.location.lng();
           
         });
       });
     });
   }
   myFunc(){
     console.log(this.isSelectedDirectory);
     console.log(this.isSelectedIndustry);
   }
   changeIndustry(name){
     this.isSelectedIndustry = name;
     console.log(this.isSelectedIndustry);
   }
   changeSearchEngine(name){
    //  this.isSelected = name;
   }
   searchList(query){
     var req = { "location": query,"industry": this.isSelectedIndustry};
     console.log(req);
     this.cms.ypSearch(req).subscribe(res =>{
     this.rowData.next(res.json().result);
     })
   }
 
    private setCurrentPosition() {
     if ("geolocation" in navigator) {
       navigator.geolocation.getCurrentPosition((position) => {
         this.latitude = position.coords.latitude;
         this.longitude = position.coords.longitude;
         
       });
     }
   }
  }
