import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bitcoin from 'bitcoinjs-lib';


export class DataService {
  constructor(private http: HttpClient, private network: any) {
    network = bitcoin.networks.testnet;
  }

  // Look up the public address (or wallet/HD wallet name) you’re interested in querying
  //  and retrieve the transaction history and account balance
  getAddressInformation(address: string) {
    // Url for transaction history api call
    const url = 'https://api.blockcypher.com/v1/btc/main/addrs/' + address;
    // get request
    const req = this.http.get(url);
    return req;
  }

  // Make transaction
  makeTransaction() {
    // Network specification
    const test = this.network;
    console.log(test);
    // // Generating our testnet Keypair
    // const keypair = bitcoin.ECPair.makeRandom({ network: testnet });
    // // address
    // const addr = bitcoin.payments.p2pkh({
    //   pubkey: keypair.publicKey,
    //   network: bitcoin.networks.testnet
    // });
    // // private key
    // const pk = keypair.toWIF();
    // console.log(addr, pk);
  }
}
