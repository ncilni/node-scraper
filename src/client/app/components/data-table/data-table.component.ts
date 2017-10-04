import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'C:/Users/neeraj.chauhan/Documents/July_2017/JumpCrew-Scraper/node_modules/@swimlane/ngx-datatable/release/index.css'
import 'C:/Users/neeraj.chauhan/Documents/July_2017/JumpCrew-Scraper/node_modules/@swimlane/ngx-datatable/release/themes/material.css';
import 'C:/Users/neeraj.chauhan/Documents/July_2017/JumpCrew-Scraper/node_modules/@swimlane/ngx-datatable/release/assets/icons.css';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  inputs: ['rows']
})
export class DataTableComponent implements OnInit {
  editing = {};
  rows: Observable<any[]>;
  columns = [{ prop: 'result_id', name: 'Result Id'  }, { prop:'business_name', name: 'Business Name' }, {prop:'contact_name', name: 'Contact Name' }, {prop:'address', name: 'Address' }, {prop:'email', name: 'Email' }, {prop:'job_title', name: 'Job Title' }, {prop:'phone', name: 'Phone' }, { name: 'Industry' }, { name: 'Website' }];
  selected = [];

  
  ngOnInit() {
    
  }
  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }
  onActivate(event) {
    console.log('Activate Event', event);
  }
}
