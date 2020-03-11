import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { TsdbService } from '../../../tsdb.service';

@Component({
  selector: 'app-tsdb-monitor',
  templateUrl: './tsdb-monitor.component.html',
  // styleUrls: ['./tsdb-monitor.component.css']
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

  generateMonitorPto(metricName1: string, metricName2: string, resolution: string, startTime: number, endTime: number) {
      const metric1 = { agg_func: 'sum', name: metricName1 };
      const metric2 = { agg_func: 'sum', name: metricName2 };
      const metrics = [];
    if (metricName2 === null) {
      metrics.push(metric1);
    } else {
      metrics.push(metric1, metric2);
    }
    const pto = {
      metrics: metrics,
      resolution: resolution,  // m, s
      timeRange: {
        end: {
          value: endTime,
          unit: 'm'
        },
        start: {
          value: startTime,
          unit: 'm'
        },
        type: 2 // 监控页面的所有图都是相对时间
      }
    };
    return pto;
  }

  generateEchartOption(legend: [string, string], dataX: any[], dataS1: any[], nameS1: string, dataS2: any[], nameS2: string) {
    const series = [];
    const series1 = { data: dataS1, type: 'line', symbol: 'rect', symbolSize: '6', hoverAnimation: false, name: nameS1 }; // '每分钟读取请求'
    const series2 = { data: dataS2, type: 'line', symbol: 'rect', symbolSize: '6', hoverAnimation: false, name: nameS2 }; // '每分钟写入请求'
    if (dataS2.length === 0 || dataS2 === null) {
      series.push(series1);
    } else {
      series.push(series1, series2);
    }
    const echartOption = {
      height: '180',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: { color: '#e9e9e9' },
          animation: false
        }
      },
      grid: {
        left: '0',
        right: '12',
        bottom: '0',
        containLabel: true
      },
      color: ['#95c16e', '#69c7f7', '#FF3030', '#CDAD00', '#f8b551'],
      legend: {
        right: '10',
        top: '0',
        data: legend // ['每分钟读取请求', '每分钟写入请求']
      },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          color: '#5a5a5a',
        },
        nameGap: 2,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e9e9e9'
          }
        },
        axisLabel: {
          interval: 3,
          color: '#5a5a5a'
        },
        axisLine: {
          lineStyle: {
            color: '#919191'
          }
        },
        data: dataX
      },
      yAxis: {
        type: 'value',
        name: '指标值',
        nameTextStyle: {
          color: '#5a5a5a',
        },
        splitNumber: 10,
        splitLine: {
          lineStyle: {
            color: ['#e9e9e9', '#fff']
          }
        },
        axisLabel: {
          color: '#5a5a5a'
        },
        axisLine: {
          lineStyle: {
            color: '#919191'
          }
        },
        max: null,
        min: null
      },
      series: series
    };
    return echartOption;
  }

  setEchartOption1(pto: any) {
    this.isSpinning1 = true;
    let read = [];
    let write = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      if (response.result !== undefined) {
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
        this.echartOption1 = this.generateEchartOption(['每分钟读取请求', '每分钟写入请求'], timestamps, read, '每分钟读取请求', write, '每分钟写入请求');
      } else {
        // this.echartOption1 = this.generateEchartOption(['每分钟读取请求', '每分钟写入请求'], timestamps, read, '每分钟读取请求', write, '每分钟写入请求');
        this.echartOption1 = false;
      }

      // 控制台信息
      console.log('图一！' + response.statusText + response.status);
      this.isSpinning1 = false;
    }
    );
  }

  setEchartOption2(pto: any) {
    this.isSpinning2 = true;
    let data = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      this.isSpinning2 = false;
      if (response.result !== undefined) {
        if (response.result[2].length !== 0) {
          for (const long in response.result[2]) {
            if (response.result[2].hasOwnProperty(long)) {
              const timestamp = new Date(Number(response.result[2][long]) * 1000).toTimeString().substring(0, 8);
              timestamps.push(timestamp);
            }
          }
          data = response.result[3];
        this.echartOption2 = this.generateEchartOption(['每秒钟写入数据点', ''], timestamps, data, '每秒钟写入数据点', [], '');
      }
      } else {
      this.echartOption2 = false;
    }

    // 控制台信息
    console.log('图二！' + response.statusText + response.status);
  }
    );
  }

  setEchartOption3(pto: any): any {
    this.isSpinning3 = true;
    let data = [];
    const timestamps = [];
    this.tsdbService.monitors(this.tsdbId, pto).subscribe(response => {
      this.isSpinning3 = false;
      if (response.result !== undefined) {
        if (response.result[2].length !== 0) {
          for (const long in response.result[2]) {
            if (response.result[2].hasOwnProperty(long)) {
              const timestamp = new Date(Number(response.result[2][long]) * 1000).toTimeString().substring(0, 5);
              timestamps.push(timestamp);
            }
          }
          data = response.result[3];
          this.echartOption3 = this.generateEchartOption(['每分钟写入数据点', ''], timestamps, data, '每分钟写入数据点', [], '');
        }
      } else {
        this.echartOption3 = false;
      }
      // 控制台信息
      console.log('图三！' + response.statusText + response.status);
    });

  }

  initCharts() {
    // metric1, metric2, resolution, startTime (in m), endTime (in m)
    this.setEchartOption1(this.generateMonitorPto('write.request', 'read.request', 'm', 30, 0));
    this.setEchartOption2(this.generateMonitorPto('write.count', null, 's', 1, 0 ));
    this.setEchartOption3(this.generateMonitorPto('write.count', null, 'm', 30, 0 ));
  }

  changeTimeRange(index: number, range: string) {
    // metric1, metric2, resolution, startTime (in m), endTime (in m)
    switch (index) {
      case 1:
        this.setEchartOption1(this.generateMonitorPto('write.request', 'read.request', 'm', Number(range), 0));
        break;

      case 2:
        this.setEchartOption2(this.generateMonitorPto('write.count', null, 's', Number(range), 0 ));
        break;

      case 3:
        this.setEchartOption3(this.generateMonitorPto('write.count', null, 'm', Number(range), 0 ));
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
