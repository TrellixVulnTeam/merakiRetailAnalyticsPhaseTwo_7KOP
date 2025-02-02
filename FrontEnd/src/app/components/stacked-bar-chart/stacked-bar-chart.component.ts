import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";

@Component({
  selector: "stacked-bar-chart",
  templateUrl: "./stacked-bar-chart.component.html",
  styleUrls: ["./stacked-bar-chart.component.scss"]
})
export class StackedBarChartComponent implements OnInit {
  constructor(private http: HttpClient) {}

  initAbandonedData: any;
  selectedValue: string;
  predictedArray: any = [];
  currentArray: any = [];
  tempArray: any = [];

  // {
  //   label: 'Current',
  //   data: [41, 11, 24, 54, 70, 57, 27,41, 11, 24, 54, 70, 57, 27,41, 11, 24, 54, 70, 57, 27]
  // }

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Datewise Till Now", viewValue: "This Month" },
    { value: "Datewise", viewValue: "Last Month" }
  ];

  public chartType: string = "bar";
  public chartLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  public chartData = [
    {
      label: "current",
      data: []
    },
    {
      label: "predicted",
      data: []
    }
  ];

  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "#ADC861"
    },
    {
      backgroundColor: "#808080"
    }
  ];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    legend: {
      display: true
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 3,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 2,
            beginAtZero: false
          }
        }
      ]
    }
  };

  // changeGran(garnularity) {
  //   this.chartLabels = [];
  //   console.log(garnularity.value);
  //   this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalAbandonments?pattern=' + garnularity.value)
  //     .subscribe(res => {
  //       this.chartData = [];
  //       console.log(res);
  //       this.initAbandonedData = res;
  //       for (let i of this.initAbandonedData) {
  //         this.chartData.push(i.count);
  //         this.chartLabels.push(i.timerange);
  //       }
  //       this.updateChart(this.chartData, this.chartLabels)
  //     })
  // }  

  ngOnInit() {

    forkJoin([
      this.http.get(
        "http://localhost:4004/api/v0/meraki/camera/historicalDataByCamera?pattern=this%20week"
      ),
      this.http.get(
        "http://localhost:4004/api/v0/meraki/camera/dailyPredictions"
      )
    ]).subscribe(res => {
      this.chartData = [{
        label: "current",
        data: []
      },
      {
        label: "predicted",
        data: []
      }];
      this.currentArray = res[0];
      this.predictedArray = res[1];
      this.predictedArray = this.predictedArray.slice(0, 7);

      for (let i of this.currentArray) {
        this.chartData[0]["data"].push(i.count);
      }

      for (let i of this.predictedArray) {
        this.chartData[1]["data"].push(i.predicted);
      }
    });
  }
}
