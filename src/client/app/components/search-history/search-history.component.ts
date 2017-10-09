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
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit {
// declarations   
 data:any={};
 resp:any;
 settings = {
  actions:{
    add: false,
    edit: false,
    delete: false
  },
  columns: {
    searchId: {
      title: 'Search Id'
    },
    location: {
      title: 'Location'
    },
    industry: {
      title: 'Industry'
    },
    search_directory: {
      title: 'Directory Searched'
    },
    date: {
      title: 'Date'
    }
  }
};

  // end of declarations



  constructor(public ss:SearchService, public route:ActivatedRoute, public router:Router) { 
     
   }


  

   ngOnInit() {
   
   

    
    
     this.ss.getHistory().subscribe(res=>
       {this.resp=res.json()
         this.data=this.resp.result;
       console.log('Data:',this.resp);
       }
     )
   
 }
}
