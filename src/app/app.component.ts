import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from './data.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'CodingChallenge';
  chart: [];
  @ViewChild('canvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  constructor(private data: DataService) {}

  ngAfterViewInit() {
    this.data.marketData().subscribe(result => {
      // out data set
      const data = JSON.parse(JSON.stringify(result));
      // define the data we are going to watch
      // daily close price
      const dailyClose = data.Data.map(res => res.close);
      // daily high price
      const dailyHigh = data.Data.map(res => res.high);
      // all the dates
      const allDates = data.Data.map(res => res.time);
      // all the dates are going to go in here after conversion
      const priceDates = [];
      // have to transform all the dates into a readable format
      allDates.forEach(element => {
        // have to multiply by 1000 because we are working with Js
        const jsdate = new Date(element * 1000);
        // convert date format
        priceDates.push(jsdate.toLocaleTimeString('en', {year: 'numeric', month: 'short', day: 'numeric'}));
      });
      this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
      this.chart = new Chart(this.context, {
        type: 'line',
          data: {
            labels: priceDates,
            datasets: [
              {
                label: 'Daily Close Price',
                data: dailyClose,
                borderColor: '#3cba9f',
                fill: false
              },
              {
                label: 'Daily High Price',
                data: dailyHigh,
                borderColor: '#ffcc00',
                fill: false
              },
            ]
          },
          options: {
            title: 'Daily Bitcoin Price Data in USD',
            legend: {
              display: true
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
      });
    });
  }
}
