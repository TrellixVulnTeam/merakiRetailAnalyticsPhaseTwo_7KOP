import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { ChartdataService } from "src/app/services/chartdata.service";
import { config } from "../../../environments/config";

@Component({
  selector: "charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.scss"]
})
export class ChartsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private chartService: ChartdataService
  ) {}
  selectedValue: any;
  granularity: any;
  pattern: string = "";
  isDisabled: boolean = true;
  zones: any;
  zoneName: any;
  zoneGranularity: any;
  zoneDataFetched: any;
  zoneLabels: any;
  zoneChartFlag: boolean = false;
  selectedValueZone: any;
  selectedValuePeriod: any;
  count: number = 0;

  currentArray: any;
  predictedArray: any;

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Datewise Till Now", viewValue: "This Month" },
    { value: "Datewise", viewValue: "Last Month" }
  ];

  proximityDataFetched: any;
  proximityPredDataFetched: any;

  scanningDataFetched: any;
  proximityChartData = [];
  scanningChartData = [];

  zoneAnalysisInitData: any;
  visitorPatternInitData: any;
  visitorPatternInitPredData: any;

  zoneHttpOptions = {
    zoneId: "1",
    timeRange: "today"
  };

  public chartType: string = "bar";
  public chartLabels: Array<any> = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23
  ];
  public chartData = [
    {
      label: "actual",
      data: []
    },

    {
      label: "predicted",
      data: []
    }
  ];
  public colorOptions: Array<any> = [
    {
      backgroundColor: "#8FBC8F"
    },
    {
      backgroundColor: "#808080"
    }
  ];
  public chartOptions: any = {
    responsive: true,
    legend: {
      display: true
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 1,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 4,
            beginAtZero: true
          }
        }
      ]
    }
  };

  public chartType2: string = "bar";
  public chartLabels2: Array<string> = [];
  public chartData2: Array<number> = [];
  public colorOptions2: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(83, 173, 227,0.5)",
      borderColor: "#00496B"
    }
  ];
  public chartOptions2: any = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 1,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 3,
            beginAtZero: true
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.yLabel;
        }
      }
    }
  };


  //Camera Data Chart Update Functions start

  proximityChartUpdate(granularity) {
    if (granularity == "Daily Till Now" || granularity == "Hourly Till Now") {
      this.chartService.getChartData().subscribe(res => {
        this.chartData = [
          { label: "actual", data: [] },
          { label: "predicted", data: [] }
        ];
        console.log(granularity);
        this.proximityDataFetched = res[0];
        this.proximityPredDataFetched = res[1];
        console.log(res);
        console.log(granularity);
        if(granularity == "Hourly Till Now"){
          this.proximityPredDataFetched.unshift(0);
        }
        for (let i of this.proximityDataFetched) {
          this.chartData[0]["data"].push(Math.ceil(i.count));
        }

        for (let i of this.proximityPredDataFetched) {
          if(i.predicted < 0){
            this.chartData[1]["data"].push(0);
          }
          else{
            this.chartData[1]["data"].push(i.predicted);
          }
        }
      });
    } else if (granularity == "Daily" || granularity == "Hourly") {
      this.chartService.getChartData().subscribe(res => {
        this.chartData = [];
        this.chartData = [
          { label: "actual", data: [] },
          { label: "predicted", data: [] }
        ];
        let temp: any = [];
        temp = res;

        console.log(res);
        console.log(granularity);
        let current:any = res[0];
        let predicted:any = res[1];
        if(granularity == "Hourly"){
          predicted.unshift(0);
        }

        for (let i of current) {
          this.chartData[0]["data"].push(i.count);
        }
        for (let i of predicted) {
          if(i.predicted < 0){
            this.chartData[1]["data"].push(0);
          }
          else{
            this.chartData[1]["data"].push(i.predicted);
          }
        }
      });
    }
    else if (granularity == "Datewise Till Now" || granularity == "Datewise") {
      this.chartService.getChartData().subscribe(res => {
        this.chartData = [];
        this.chartData = [
          { label: "actual", data: [] },
          { label: "predicted", data: [] }
        ];
        let temp: any = [];
        let current:any = res[0];
        let predicted:any = res[1];

        console.log('monthly data',res);
        console.log(granularity);

        for (let i of current) {
          this.chartData[0]["data"].push(i.count);
        }
        for (let i of predicted) {
          if(i.predicted < 0){
            this.chartData[1]["data"].push(0);
          }
          else{
            this.chartData[1]["data"].push(i.predicted);
          }
        }
      });
    }
  }

  changeGran(gran) {
    this.granularity = gran.value;

    this.chartService.setGranularity(this.granularity);

    if (this.granularity == "Daily Till Now" || this.granularity == "Daily") {
      this.chartService.getChartData().subscribe(res => {
        this.chartLabels = [];

        
          this.proximityDataFetched = res[0];
          for (let i of this.proximityDataFetched) {
            let now = i.timerange;
            let newDate = new Date(now);
            let dateString = newDate.toString().split(" ")[0];
            this.chartLabels.push(dateString);
          }
        
      });

      this.setChartLabels(this.chartLabels);
    } else if (
      this.granularity == "Hourly Till Now" ||
      this.granularity == "Hourly"
    ) {
      this.chartLabels = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ];
    } else {
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1;
      console.log(month);
      var thirtyOneDays = [1, 3, 5, 7, 8, 10, 12];

      for (let i of thirtyOneDays) {
        if (i == month) {
          this.chartLabels = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31];
            break;
        }
        else {
          this.chartLabels=[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30
          ];
        }
      }
    }

    this.proximityChartUpdate(this.granularity);
  }

  //Camera Data Chart Update Functions end


  //Zone analysis Chart Update Functions

  changeZone(zone) {
    this.isDisabled = false;
    this.zoneName = zone.value;
    this.chartService.setZoneId(zone);

    this.chartService.getZoneChartData().subscribe(res => {
      this.chartLabels2 = [];
      this.zoneLabels = res;
      for (let i of this.zoneLabels) {
        this.chartLabels2.push(i["timerange"]);
      }
    });

    this.setZoneChartLabels(this.chartLabels2);
    this.zoneAnalysisChartUpdate();
  }

  changeZoneGran(gran) {
    this.zoneGranularity = gran.value;
    this.chartService.setZoneGranularity(this.zoneGranularity);

    this.chartService.getZoneChartData().subscribe(res => {
      this.chartLabels2 = [];
      this.zoneLabels = res;
      for (let i of this.zoneLabels) {
        this.chartLabels2.push(i["timerange"]);
      }
    });

    this.setZoneChartLabels(this.chartLabels2);
    this.zoneAnalysisChartUpdate();
  }

  zoneAnalysisChartUpdate() {
    this.chartService.getZoneChartData().subscribe(res => {
      this.chartData2 = [];
      this.zoneDataFetched = res;
      for (let i of this.zoneDataFetched) {
        this.chartData2.push(i["detected_clients"]);
      }
      if (this.zoneDataFetched.length == 0) {
        this.chartData2.push(0);
      }
    });

    this.setZoneChartData(this.chartData2);
  }

  //Zone analysis Chart Update Functions


  // private setChartData(data) {
  //   this.chartData.push(data);
  // }

  private setChartLabels(labels) {
    this.chartLabels = labels;
  }

  private setZoneChartData(data) {
    this.chartData2 = data;
  }

  private setZoneChartLabels(labels) {
    this.chartLabels2 = labels;
  }

  ngOnInit() {
    this.selectedValue = "Hourly Till Now";
    this.selectedValueZone = 1;
    this.selectedValuePeriod = "Hourly Till Now";

    this.http
      .get(config.ipAddress+"/api/v0/meraki/camera/zones")
      .subscribe(res => {
        this.zones = res;
      });

    this.http
      .post(
        config.ipAddress+"/api/v0/meraki/camera/clients",
        this.zoneHttpOptions
      )
      .subscribe(res => {
        this.chartData2 = [];
        this.zoneAnalysisInitData = res;
        for (let i of this.zoneAnalysisInitData) {
          this.chartData2.push(i.detected_clients);
        }
        this.setZoneChartData(this.chartData2);
      });

    this.http
      .post(
        config.ipAddress+"/api/v0/meraki/camera/clients",
        this.zoneHttpOptions
      )
      .subscribe(res => {
        this.chartLabels2 = [];
        this.zoneAnalysisInitData = res;
        for (let i of this.zoneAnalysisInitData) {
          this.chartLabels2.push(i.timerange);
        }
        this.setZoneChartLabels(this.chartLabels2);
      });

    forkJoin([
      this.http.get(
        config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern=today"
      ),
      this.http.get(
        config.ipAddress+"/api/v0/meraki/camera/hourlyPredictions"
      )
    ]).subscribe(res => {
      this.chartData = [
        { label: "actual", data: [] },
        { label: "predicted", data: [] }
      ];
      this.currentArray = res[0];
      this.predictedArray = res[1];
      
      this.predictedArray.unshift(0);

      for (let i of this.currentArray) {
        if (i.timerange <= 7 || i.timerange >= 23) {
          this.chartData[0]["data"].push(1);
        } else {
          this.chartData[0]["data"].push(i.count);
        }
      }

      for (let i of this.predictedArray) {
        if(i.predicted < 0){
          this.chartData[1]["data"].push(0);
        }
        else{
          this.chartData[1]["data"].push(i.predicted);
        }
        
      }
    });
  }
}
