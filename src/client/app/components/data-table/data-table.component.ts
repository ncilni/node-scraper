import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  inputs: ['rows']
})
export class DataTableComponent implements OnInit {
  editing = {};
  rows: Observable<any[]>;
  columns = [{ prop: 'result_id', name: 'Result Id'  }, { prop:'business_name', name: 'Business Name' }, { name: 'Contact Name' }, { name: 'Address' }, { name: 'Email' }, { name: 'Job Title' }, { name: 'Phone' }, { name: 'Industry' }, { name: 'Website' }];
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
