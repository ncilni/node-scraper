import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { Component, OnInit, NgZone, ViewChild, ElementRef,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { } from 'googlemaps';
import { CommonServiceService } from '../../common-service.service';
import { SearchService } from '../../core/search.service';
import {CsvService} from "angular2-json2csv";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent implements OnInit {
  file_name: string;
  public searchControl: FormControl;
  @ViewChild("searchtxt")
  public searchElementRef: ElementRef;
  isSelectedIndustry ;
  isSelectedLocation;
  isSelectedFormat;
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
 formats = [
  {id: 1, name: "csv"},
  {id: 2, name: "xls"},
  {id: 3, name: "pdf"}
];
 location:any ={};
 data:any={};
 resp:any={};
 resultData:any={};
 resultResp:any;
 filepath;
 settings = {
  actions:{
    add: false,
    edit: false,
    delete: false
  },
  columns: {
    result_id: {
      title: 'Result Id'
    },
    business_name:{
      title: 'Business Name'
    },
    search_location: {
      title: 'Location'
    },
    industry: {
      title: 'Industry'
    },
    searchId: {
      title: 'Search Id'
    },
    date: {
      title: 'Date'
    }
  }
};

    // end of declarations

    constructor(private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,public ss:SearchService, public router:Router, private _csvService: CsvService) { }

  ngOnInit() { }
  selectIndustry($event){
    console.log('option selected', this.isSelectedIndustry);
    this.ss.getLocation(this.isSelectedIndustry).subscribe(res=>
      {this.data=res.json()
      this.location=this.data.result;
      console.log('Data:',this.data);
      }
    )
  }

  saveExcel(param: any, filename: string) {
    var wb = new Workbook();

    var write = new Array;
    param.forEach(function (row,index) {

        var each = new Array;
        var keys = Object.keys(row); // all the keys
        if (index == 0) {
            // column headers
            for (var i = 0; i < keys.length; i++) {
                each.push(keys[i]);
            }
            write.push(each); // write header
            each = [];
            for (var i = 0; i < keys.length; i++) {
                each.push(row[keys[i]]);
            }
        }
        else
        {
            for (var i = 0; i < keys.length; i++) {
                each.push(row[keys[i]]);
            }
        }
        write.push(each);
    }, this);

    var data = write;

    var ws_name = "Sheet 1";
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = this.sheet_from_array_of_arrays(data);

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }); //bookSST: true,
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), filename+".xlsx");
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  sheet_from_array_of_arrays(data: any, opts?: any): any {
    var ws: any = {};
  
    var wscols = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
    ];
  
    var startCell = { c: 10000000, r: 10000000 };
    var endCell = { c: 0, r: 0 };
  
    var range = { s: startCell, e: endCell };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            //var cell = { v: data[R][C], t: 'n' };
            //if (cell.v == null) continue;
            //var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
  
            //if (typeof cell.v === 'number') cell.t = 'n';
            //else if (typeof cell.v === 'boolean') cell.t = 'b';
            //else cell.t = 's';
  
            //var cell = new Cell();
            var cell: any = {};
            cell.v = data[R][C];
            //console.log(cell);
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            //console.log(cell_ref);
            if (cell.v == null) continue;
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else cell.t = 's';
            //console.log(cell);
            ws[cell_ref] = cell;
            //console.log(ws);
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(startCell, endCell);
    ws['!cols'] = wscols;
    return ws;
  }



  
  showformat(){
    console.log('selected format:',this.isSelectedFormat);
  }

  createPdf(fname){
    console.log("inside createPdf", fname);
      // var item =[ {
      //   "Name" : "XYZ",
      //   "Age" : "22",
      //   "Gender" : "Male"
      // },
      // {
      //  "Name" : "XYZ",
      //   "Age" : "22",
      //   "Gender" : "Male"
      // }];
      var item=[  
      {result_id: 2179, business_name: "Sugar Shack Donuts & Coffee", address: "1932 9th St NWWashington, DC 20001 ", email: null, contact_name: null},
      {result_id: 2180, business_name: "Blue Bottle Coffee", address: "1046 Potomac St NWWashington, DC 20007 ", email: null, contact_name: null},
      {result_id: 2181, business_name: "A Baked Joint", address: "440 K St NWWashington, DC 20001 ", email: null, contact_name: null},
      {result_id: 2182, business_name: "La Colombe Coffee", address: "924 Rear N St NWWashington, DC 20001 ", email: null, contact_name: null},
      {result_id: 2183, business_name: "Bakers & Baristas", address: "501 7th St NWWashington, DC 20004 ", email: null, contact_name: null},
      {result_id: 2184, business_name: "Swing’s Coffee", address: "640 14th St NWWashington, DC 20005 ", email: null, contact_name: null},
      {result_id: 2185, business_name: "The Coffee Bar", address: "1201 S St NWWashington, DC 20009 ", email: null, contact_name: null},
      {result_id: 2186, business_name: "Bourbon Coffee", address: "2101 L St NWWashington, DC 20037 ", email: null, contact_name: null},
      {result_id: 2187, business_name: "The Wydown Coffee Bar", address: "1924 14th St NWWashington, DC 20009 ", email: null, contact_name: null},
      {result_id: 2188, business_name: "Emissary", address: "2032 P St NWWashington, DC 20036 ", email: null, contact_name: null},
      {result_id: 2189, business_name: "Filter Coffeehouse & Espresso Bar", address: "1726 20th St NWWashington, DC 20009 ", email: null, contact_name: null}
      ];
     


      var col = ["Id", "Business Name","Address","Contact Name"];
      var rows = [];
  
      
      for(var key in item){
          var temp = [item[key].result_id, item[key].business_name,item[key].address,item[key].contact_name];
          rows.push(temp);
      }

      var doc = new jsPDF('l', 'mm', [595.28, 841.89]);  jpt; 
  
      doc.autoTable(col, rows, {
        showHeader: 'Industry='+this.isSelectedIndustry+'and Location='+this.isSelectedLocation,
        styles: { fontSize: 16,
          overflow: 'linebreak',
          columnWidth: 'auto',
          lineWidth: 1,
          lineColor: [85, 51, 27]
        },
        theme: 'grid', // 'striped', 'grid' or 'plain'
        headerStyles: {
              fillColor: [189, 200, 255],
              textColor: [12, 1, 1]
          },
        avoidPageSplit: true,
        margin: { right: 30 }
    });




      // doc.autoTable(col, rows,{
      //   theme: 'grid', // 'striped', 'grid' or 'plain'
      //   headerStyles: {
      //         fillColor: [189, 200, 255],
      //         textColor: [12, 1, 1]
      //     },
      //     pdfSize:'a1',
      //    // margin: { top: 50, left: 20, right: 20, bottom: 0 },
      //   styles: {
      //         overflow: 'linebreak',
      //         columnWidth: 'auto',
      //         lineWidth: 1,
      //         lineColor: [85, 51, 27]
              
      //       },
      //       pageBreak: 'avoid',
      //       beforePageContent: function(data) {
      //         doc.setFontSize(12);
      //           doc.text("Results for Industry :"+this.isSelectedIndustry+"  ||   "+"Location :"+this.isSelectedLocation, 20, 15);
                
      //       },
      //     columnStyles: {
      //       //0: {columnWidth: 200}
      //     }
      //   });
  
      doc.save(fname+'.pdf');
    


  }

  createCsv(fname){
    this._csvService.download(this.resp, fname);
  }

  createXls(fname){
      // var data = [
      //     [1, 2, 3],
      //     [true, false, null, "sheetjs"],
      //     ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"],
      //     ["baz", null, "qux"]
      //   ];
  
    
  
      this.saveExcel(this.resp,fname );
  
    };
  
  
  

  downloadFile(){
    // console.log('format:',this.isSelectedFormat);
    var re = / /gi; 
    var loc = this.isSelectedLocation.replace(re, "_"); 
    var indus = this.isSelectedIndustry.replace(re, "_"); 
    this.file_name=loc+'_'+indus;
    switch(this.isSelectedFormat) { 
      case 'csv': { 
         this.createCsv(this.file_name); 
         break; 
      } 
      case 'xls': { 
        this.createXls(this.file_name);
         break; 
      } 
      case 'pdf': { 
        this.createPdf(this.file_name);
         break; 
      } 
   } 
  }

  showResults($event){
    console.log('option selected', this.isSelectedLocation);
    var req = { "location": this.isSelectedLocation,"industry": this.isSelectedIndustry};
    this.ss.getHistoryResults(req).subscribe(res=>
      {this.resultData=res.json()
        this.resp=this.resultData.result;
      console.log('Data:',this.resultData);
      }
    )
  }
}

export class Workbook {
  SheetNames: any = [];
  Sheets: any = {};
  }