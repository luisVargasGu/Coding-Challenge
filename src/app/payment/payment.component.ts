import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  // sender addres
  private _sender: string;

  // reciever addres
  private _reciever: string;

  // ammount to send
  private _amount: number;

  // Get value of the sender address
  set sender(value: string) {
    this._sender = value;
  }

  // Get value of the sender address
  set reciever(value: string) {
    this._reciever = value;
  }

  // Get value of the sender address
  set amount(value: number) {
    this._amount = value;
  }

  constructor(private data: DataService) { }

  ngOnInit() {
  }

  // make transaction
  makeTransaction() {
    this.data.makeTransaction(this._sender, this._reciever, this._amount);
  }

}
