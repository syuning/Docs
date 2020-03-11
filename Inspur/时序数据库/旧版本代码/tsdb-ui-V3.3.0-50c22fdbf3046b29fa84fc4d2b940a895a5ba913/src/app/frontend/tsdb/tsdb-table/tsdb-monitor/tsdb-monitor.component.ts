import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { TsdbService } from '../../tsdb.service';

@Component({
  selector: 'app-tsdb-monitor',
  templateUrl: './tsdb-monitor.component.html',
  styleUrls: ['./tsdb-monitor.component.css']
})
export class TsdbMonitorComponent implements OnInit {
  tsdbId = this.activedRoute.snapshot.params['id'];

  timeRangeValue1 = '30';
  isSpinning1 = true;
  echartOption1: any;

  timeRangeValue2 = '1';
  isSpinning2 = true;
  echartOption2: any;

  timeRangeValue3 = '30';
  isSpinning3 = true;
  echartOption3: any;

  setEchartOption1(pto: any) {
    let read = [];
    let write = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      console.log('图一！'
      // , response
      );
      if (this.tsdbService.validateResponseCode(response.code)) {
        if (response.result.length === 6) {
          for (const long in response.result[4]) {
            if (response.result[4].hasOwnProperty(long)) {
              const timestamp = new Date(Number(response.result[4][long]) * 1000).toTimeString().substring(0, 5);
              timestamps.push(timestamp);
            }
          }
          read = response.result[5].slice(0, response.result[4].length);
          write = response.result[5].slice(response.result[4].length, response.result[5].length);
        } else if (response.result.length === 4) {
          for (const long in response.result[2]) {
            if (response.result[2].hasOwnProperty(long)) {
              const timestamp = new Date(Number(response.result[2][long]) * 1000).toTimeString().substring(0, 5);
              timestamps.push(timestamp);
            }
          }
          if (response.result[0] === 'read.request') {
            read = response.result[3];
            for (const e in response.result[2]) {
              if (response.result[2].hasOwnProperty(e)) {
                write.push(0);
              }
            }
          } else if (response.result[0] === 'write.request') {
            write = response.result[3];
            for (const e in response.result[2]) {
              if (response.result[2].hasOwnProperty(e)) {
                read.push(0);
              }
            }
          }
        }
      // } else if (this.tsdbService.validateResponseCodeEmpty(response.code)) {
        // const end = Number(new Date());
        // const start = end - 30 * 60 * 1000;
        // for (let i = start; i < end; i++) {
        //   timestamps.push(new Date(i * 30 * 60 * 1000));
        //   read.push(0);
        //   write.push(0);
        // }
      }
      this.echartOption1 = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#CDAD00', '#FF3030'],
        legend: {
          data: ['每分钟读取请求', '每分钟写入请求']
        },
        xAxis: {
          type: 'category',
          data: timestamps
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: read,
          type: 'line',
          name: '每分钟读取请求'
        }, {
          data: write,
          type: 'line',
          name: '每分钟写入请求'
        }]
      };
      this.isSpinning1 = false;
    });
  }

  setEchartOption2(pto: any) {
    let data = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      console.log('图二'
      // , response
      );
      if (this.tsdbService.validateResponseCode(response.code)) {
        this.isSpinning2 = false;
        for (const long in response.result[2]) {
          if (response.result[2].hasOwnProperty(long)) {
            const timestamp = new Date(Number(response.result[2][long]) * 1000).toTimeString().substring(0, 8);
            timestamps.push(timestamp);
          }
        }
        data = response.result[3];
      // } else if (this.tsdbService.validateResponseCodeEmpty(response.code)) {

      }
      this.echartOption2 = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#CDAD00', '#FF3030'],
        legend: {
          data: ['每秒钟写入数据点']
        },
        xAxis: {
          type: 'category',
          data: timestamps
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'line',
          name: '每秒钟写入数据点'
        }]
      };
      this.isSpinning2 = false;
    });
  }

  setEchartOption3(pto: any): any {
    let data = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      console.log('图三！'
      // , response
      );
      if (this.tsdbService.validateResponseCode(response.code)) {
        this.isSpinning3 = false;
        for (const long in response.result[2]) {
          if (response.result[2].hasOwnProperty(long)) {
            const timestamp = new Date(Number(response.result[2][long]) * 1000).toTimeString().substring(0, 5);
            timestamps.push(timestamp);
          }
        }
        data = response.result[3];
        this.echartOption3 = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#CDAD00', '#FF3030'],
          legend: {
            data: ['每分钟写入数据点']
          },
          xAxis: {
            type: 'category',
            data: timestamps
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: data,
            type: 'line',
            name: '每分钟写入数据点'
          }]
        };
      } else if (this.tsdbService.validateResponseCodeEmpty(response.code)) {
        this.echartOption3 = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#CDAD00', '#FF3030'],
          legend: {
            data: ['每分钟写入数据点']
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],
            type: 'line',
            name: '每分钟写入数据点'
          }]
        };
        this.isSpinning3 = false;
      }
    });

  }

  initCharts() {
    const pto1 = {
      'metrics': [{
          'agg_func': 'sum',
          'name': 'write.request'
        },
        {
          'agg_func': 'sum',
          'name': 'read.request'
        }
      ],
      'resolution': 'm',
      'time_range': {
        'end': {
          'value': 0,
          'unit': 'm'
        },
        'start': {
          'value': 30,
          'unit': 'm'
        },
        'type': 2
      }
    };
    this.setEchartOption1(pto1);
    const pto2 = {
      'metrics': [{
        'agg_func': 'sum',
        'name': 'write.count'
      }],
      'resolution': 's',
      'time_range': {
        'end': {
          'value': 0,
          'unit': 'm'
        },
        'start': {
          'value': 30,
          'unit': 'm'
        },
        'type': 2
      }
    };
    this.setEchartOption2(pto2);
    const pto3 = {
      'metrics': [{
        'agg_func': 'sum',
        'name': 'write.count'
      }],
      'resolution': 'm',
      'time_range': {
        'end': {
          'value': 0,
          'unit': 'm'
        },
        'start': {
          'value': 30,
          'unit': 'm'
        },
        'type': 2
      }
    };
    this.setEchartOption3(pto3);
  }

  changeTimeRange(index: number, range: string) {
    switch (index) {
      case 1:
        const pto1 = {
          'metrics': [{
              'agg_func': 'sum',
              'name': 'write.request'
            },
            {
              'agg_func': 'sum',
              'name': 'read.request'
            }
          ],
          'resolution': 'm',
          'time_range': {
            'end': {
              'value': 0,
              'unit': 'm'
            },
            'start': {
              'value': Number(range),
              'unit': 'm'
            },
            'type': 2
          }
        };
        this.setEchartOption1(pto1);
        break;

      case 2:
        const pto2 = {
          'metrics': [{
            'agg_func': 'sum',
            'name': 'write.count'
          }],
          'resolution': 's',
          'time_range': {
            'end': {
              'value': 0,
              'unit': 'm'
            },
            'start': {
              'value': Number(range),
              'unit': 'm'
            },
            'type': 2
          }
        };
        this.setEchartOption2(pto2);
        break;

      case 3:
        const pto3 = {
          'metrics': [{
            'agg_func': 'sum',
            'name': 'write.count'
          }],
          'resolution': 'm',
          'time_range': {
            'end': {
              'value': 0,
              'unit': 'm'
            },
            'start': {
              'value': Number(range),
              'unit': 'm'
            },
            'type': 2
          }
        };
        this.setEchartOption3(pto3);
        break;
    }
  }

  constructor(private activedRoute: ActivatedRoute, private tsdbService: TsdbService) {}

  ngOnInit() {
    this.initCharts();
  }
}

export class TimeRange {
  start: Date;
  end: Date;
}
