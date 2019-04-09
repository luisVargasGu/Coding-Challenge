import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Look up the public address (or wallet/HD wallet name) you’re interested in querying
  //  and retrieve the transaction history and account balance
  getAddressInformation(address: string) {
    // Url for transaction history api call
    const url = 'https://api.blockcypher.com/v1/btc/main/addrs/' + address;
    // get request
    const req = this.http.get(url);
    return req;
  }
}
