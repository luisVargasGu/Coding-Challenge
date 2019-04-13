import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bitcoin from 'bitcoinjs-lib';
import { map } from 'rxjs/operators';

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

  // Make random address using bitoinjs-lib
  makeAddress() {
    // Network specification
    const testnet = bitcoin.networks.testnet;
    // Generating our testnet Keypair
    const keypair = bitcoin.ECPair.makeRandom({ network: testnet });
    // address
    // generated addres: "n18ZedqPMA26Ffm6Uoc59F2uoxtZruaz59"
    // private key: cUajebc4TVa2h3yKTTK8JmpEtCeumovHkJXfvAD5oB2LRmfQnYTU
    const addr = bitcoin.payments.p2pkh({
      pubkey: keypair.publicKey,
      network: bitcoin.networks.testnet
    });
    // private key
    const pk = keypair.toWIF();
    console.log(addr, pk);
  }

  // Make transaction as specified by block-cypher api
  makeTransaction(sender: string, reciever: string, ammount: number) {
    const keys    =  bitcoin.ECPair.fromPublicKey(Buffer.from(sender));
    const newtx = {
      inputs: [{addresses: [sender]}],
      outputs: [{addresses: [reciever], value: ammount}]
    };
    // calling the new endpoint, same as above
    this.http.post('https://api.blockcypher.com/v1/bcy/test/txs/new', JSON.stringify(newtx))
      .subscribe(data => {
        // signing each of the hex-encoded string required to finalize the transaction
        const tmptx = JSON.parse(JSON.stringify(data));
        tmptx.pubkeys = [];
        tmptx.signatures = tmptx.tosign.map((tosign, n) => {
          tmptx.pubkeys.push(keys.publicKey.toString('hex'));
          return keys.sign(Buffer.from(tosign));
        });
        // sending back the transaction with all the signatures to broadcast
        this.http.post('https://api.blockcypher.com/v1/bcy/test/txs/send', tmptx).subscribe(finaltx => {
          console.log(finaltx);
        });
      });
  }

  // push raw transaction data using blockcypher api
  pushTransaction(hex: string) {
    const pushtx = {
      tx: hex
    };
    // url for our block-cypher call
    const url = 'https://api.blockcypher.com/v1/bcy/test/txs/push';
    // API call
    this.http.post(url, JSON.stringify(pushtx)).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  // Make a transaction from one person to another using only bitcoin-js lib
  makeTransactionTwo(sender: string, reciever: string, transactionId: string, amount: number, outputN: number) {
    // Network specification
    const testnet = bitcoin.networks.regtest;
    // create the transaction
    const txb = new bitcoin.TransactionBuilder(testnet);
    // define the transaction Id from the faucet after you send coins
    const txid = transactionId;
    // depending on faucet the number usually 0 or 1 for the output
    // can also get using the address info function #test is 1
    const outn = outputN;
    // input or the transaction id
    // 9bf8aad57528b260b32921c35495e752a171aa68a171d472b474909aeda5869a
    txb.addInput(txid, outn);
    // output who we are sending to
    // reciever: 2NGZqL7CbDkfXKVbifoBWMVH6YhzYyhdv77
    // amount: 19931763
    txb.addOutput(reciever, amount);
    // wallet import format
    // WIF: cUajebc4TVa2h3yKTTK8JmpEtCeumovHkJXfvAD5oB2LRmfQnYTU
    const WIF = sender;
    const keypairSpend = bitcoin.ECPair.fromWIF(WIF, testnet);
    // sign transaction
    txb.sign(0, keypairSpend);
    // transaction build
    const tx = txb.build();
    // readable format
    const txhex = tx.toHex();
    // push our transaction to the chain
    this.pushTransaction(txhex);
  }
  // Data for our ChartJs component
  marketData() {
    return this.http.get('https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=10')
    .pipe(map(result => result));
  }
}
