import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-search-div',
  templateUrl: './search-div.component.html',
  styleUrls: ['./search-div.component.scss']
})
export class SearchDivComponent implements OnInit {
  // data from the API call
  addrsData;
  // data about a transaction input or output
  txData;
  // search bar attribute
  private _address: string;

  // Get value of the input address
  set address(value: string) {
    this._address = value;
  }

  // return address information
  searchAddress() {
    console.log(this._address);
    this.data.getAddressInformation(this._address).subscribe(
      data => {
        this.addrsData = JSON.parse(JSON.stringify(data));
        this.txData = this.addrsData.txrefs;
        console.log(this.addrsData);
        console.log(this.txData);
      },
      error => {
        console.log(JSON.stringify(error.json()));
      }
    );
  }

  constructor(private data: DataService) {}

  ngOnInit() {}
}
