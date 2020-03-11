import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NziModalService } from 'ng-zorro-iop';
import { QueryService } from '../../../query.service';
import { QueryFormComponent } from '../query-panel/query-form/query-form.component';
import { aggFuns, interpolations, filterTypes, timeUnitOptions, metrics } from '../../../consts';

export class QueryPto {
  time_range: TimeRange;
  metrics: Metric[];
}

export class TimeRange {
  type: number;
  start: any;
  end: any;
}

export class Metric {
  name: string;
  agg_func: string;
  downsample: DownSample;
  tag_filters: TagFilter[];
}

export class DownSample {
  name: string;
  sample_time: string;
  sample_time_unit: string;
  interpolation: string;
}

export class TagFilter {
  type: string;
  name: string;
  value: string;
  group: boolean;
}

export class Template {
  timeRangeType: string;
  absoluteTimeRange: any[];
  relativeStart: number;
  relativeStartUnit: string;
  relativeEnd: number;
  relativeEndUnit: string;
  metricName: string;
  aggFun: string;
  interpolation: string;
  sampleTime: number;
  sampleTimeUnit: string;
  templateName: string;
  active: boolean;
}

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css']
})
export class QueryPanelComponent implements OnInit {

  index = 0;
  queryForm: FormGroup;
  filterTypes = filterTypes;
  aggFuns = aggFuns;
  interpolations = interpolations;
  timeUnitOptions = timeUnitOptions;
  metrics = metrics;

  cover = false;
  templates = [];
  tagFilters = [];
  tagFiltersEdited = [];

  isChartVisible = false;
  queryEchartOption = null;

  tsdbId = this.activedRoute.snapshot.params['id'];

  constructor( private activedRoute: ActivatedRoute, private fb: FormBuilder,
    private nzMessage: NzMessageService, private queryService: QueryService,
    private modalService: NziModalService) {
    this.queryForm = this.fb.group({
      timeRangeType: [ 'Absolute', [ Validators.required ]],

      // 绝对时间选择
      absoluteTimeRange: [ [new Date(1420041600000), new Date(1451491200000)], [Validators.required]],

      // 相对时间选择
      relativeStart: [1],
      relativeStartUnit: ['h'],
      relativeEnd: [0],
      relativeEndUnit: ['h'],

      metricName: ['temperature', [Validators.required, Validators.maxLength(50)]],
      aggFun: [ 'avg', [ Validators.required ]],
      interpolation: [ 'none', [ Validators.required ]],
      sampleTime: [ 1, [ Validators.required ]],
      sampleTimeUnit: [ 'd', [ Validators.required ]],

      // groupBy: [null, [Validators.required]],
      // downSampling: [null],
      // downSamplingFunc: [null],
      // downSamplingInterval: [null]
    });
  }

  ngOnInit() {
    // this.initTemplate();
  }

  changeTimeRangeType(timeRangeType: string) {
    if (timeRangeType === 'Absolute') {
      this.queryForm.get('absoluteTimeRange').setValidators([Validators.required]);
      this.queryForm.get('relativeStart').setValidators([]);
      this.queryForm.get('relativeStartUnit').setValidators([]);
      this.queryForm.get('relativeEnd').setValidators([]);
      this.queryForm.get('relativeEndUnit').setValidators([]);
    } else if (timeRangeType === 'Relative') {
      this.queryForm.get('relativeStart').setValidators([Validators.required]);
      this.queryForm.get('relativeStartUnit').setValidators([Validators.required]);
      this.queryForm.get('relativeEnd').setValidators([Validators.required]);
      this.queryForm.get('relativeEndUnit').setValidators([Validators.required]);
      this.queryForm.get('absoluteTimeRange').setValidators([]);
    }
  }

  metricValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return {
        required: true
      };
    } else if (!(/^[a-z0-9.]+$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  addTagFilter(e?: MouseEvent) {

    if (e) {
      e.preventDefault();
    }

    const id = (this.tagFilters.length > 0) ? this.tagFilters[this.tagFilters.length - 1].id + 1 : 0;

    const tagFilter = {
      id: id,
      isGroupBy: id + '_isGroupBy',
      name: id + '_name',
      type: id + '_type',
      value: id + '_value'
    };
    const index = this.tagFilters.push(tagFilter);

    this.queryForm.addControl(this.tagFilters[index - 1].isGroupBy, new FormControl(false));
    this.queryForm.addControl(this.tagFilters[index - 1].name, new FormControl(null));
    this.queryForm.addControl(this.tagFilters[index - 1].type, new FormControl(null));
    this.queryForm.addControl(this.tagFilters[index - 1].value, new FormControl(null));
  }

  removeTagFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.tagFilters.indexOf(i);
    this.tagFilters.splice(index, 1);
    this.queryForm.removeControl(i.isGroupBy);
    this.queryForm.removeControl(i.name);
    this.queryForm.removeControl(i.type);
    this.queryForm.removeControl(i.value);
  }

  initTemplate() {
    const start: Date = new Date(1420041600000);
    const end: Date = new Date(1451491200000);
    const absoluteTimeRange: any[] = [];
    absoluteTimeRange.push(start);
    absoluteTimeRange.push(end);
    const t0 = {
      timeRangeType: 'Absolute',
      absoluteTimeRange: null,
      relativeStart: null,
      relativeStartUnit: null,
      relativeEnd: null,
      relativeEndUnit: null,
      metricName: null,
      aggFun: null,
      interpolation: null,
      sampleTime: null,
      sampleTimeUnit: null,
      templateName: '数据查询',
      active: true
    };
    const t1: Template = {
      timeRangeType: 'Absolute',
      absoluteTimeRange: absoluteTimeRange,
      relativeStart: 0,
      relativeStartUnit: 'h',
      relativeEnd: 0,
      relativeEndUnit: 'h',
      metricName: 'humid',
      aggFun: 'sum',
      interpolation: 'none',
      sampleTime: 1,
      sampleTimeUnit: 'd',
      templateName: '2015年湿度总和',
      active: false
    };
    const t2: Template = {
      timeRangeType: 'Absolute',
      absoluteTimeRange: absoluteTimeRange,
      relativeStart: 0,
      relativeStartUnit: 'h',
      relativeEnd: 0,
      relativeEndUnit: 'h',
      metricName: 'temperature',
      aggFun: 'avg',
      interpolation: 'none',
      sampleTime: 1,
      sampleTimeUnit: 'd',
      templateName: '2015年平均温度',
      active: false
    };
    const t3: Template = {
      timeRangeType: 'Absolute',
      absoluteTimeRange: absoluteTimeRange,
      relativeStart: 0,
      relativeStartUnit: 'h',
      relativeEnd: 0,
      relativeEndUnit: 'h',
      metricName: 'wind',
      aggFun: 'max',
      interpolation: 'none',
      sampleTime: 1,
      sampleTimeUnit: 'd',
      templateName: '2015年风度最大值',
      active: false
    };
    this.templates.push(t0, t1, t2, t3);
    this.useTemplate(true, t0);
  }

  useTemplate(e: boolean, template: Template) {
    if (e) {
      this.queryForm.setValue({
        timeRangeType: template.timeRangeType,
        absoluteTimeRange: template.absoluteTimeRange,
        relativeStart: template.relativeStart,
        relativeStartUnit: template.relativeStartUnit,
        relativeEnd: template.relativeEnd,
        relativeEndUnit: template.relativeEndUnit,
        metricName: template.metricName,
        aggFun: template.aggFun,
        interpolation: template.interpolation,
        sampleTime: template.sampleTime,
        sampleTimeUnit: template.sampleTimeUnit,

        // groupBy: null,
        // downSampling: null,
        // downSamplingFunc: null,
        // downSamplingInterval: null
      });
      console.log('使用模版', template.templateName, '成功！',
      // template
      );
    }
  }

  submitQueryForm() {
    for (const key in this.queryForm.controls) {
      if (this.queryForm.controls.hasOwnProperty(key)) {
        this.queryForm.controls[ key ].markAsDirty();
        this.queryForm.controls[ key ].updateValueAndValidity();
      }
    }
    if (this.queryForm.valid) {
    this.createLineChart();
    } else {
      this.nzMessage.error('输入参数不合法，请重新输入！');
    }
  }

  resetForm(): void {
    for (const key in this.queryForm.controls) {
      if (this.queryForm.controls.hasOwnProperty(key)) {
      this.queryForm.controls[ key ].markAsPristine();
      this.queryForm.controls[ key ].updateValueAndValidity();
    }
  }
  let i = 0;
  while (this.queryForm.get(i + '_isGroupBy') !== null) {
    this.queryForm.removeControl(i + '_isGroupBy');
    this.queryForm.removeControl(i + 'name');
    this.queryForm.removeControl(i + 'type');
    this.queryForm.removeControl(i + 'value');
    i++;
  }
  this.queryForm.reset();
  this.queryForm.get('timeRangeType').setValue('A');
  }

  createLineChart() {
    const pto = new QueryPto;
    const timeRange = new TimeRange;
    const metric = new Metric;
    const downsample = new DownSample;
    metric.downsample = downsample;
    pto.metrics = [];
    pto.time_range = timeRange;

    // 1 Absolute time , 2 Relative time
    if (this.queryForm.value.timeRangeType === 'Absolute') {
      pto.time_range.type = 1;
    } else if (this.queryForm.value.timeRangeType === 'Relative') {
      pto.time_range.type = 2;
    } else {
      pto.time_range.type = 0;
    }
    if (this.queryForm.value.timeRangeType === 'Absolute') {
      pto.time_range.start = this.queryForm.value.absoluteTimeRange[0];
      pto.time_range.end = this.queryForm.value.absoluteTimeRange[1];
    } else if (this.queryForm.value.timeRangeType === 'Relative') {
      pto.time_range.start = { value: this.queryForm.value.relativeStart, unit: this.queryForm.value.relativeStartUnit};
      pto.time_range.end = { value: this.queryForm.value.relativeEnd, unit: this.queryForm.value.relativeEndUnit};
    }
    metric.name = this.queryForm.value.metricName;
    metric.agg_func = this.queryForm.value.aggFun;
    metric.downsample.name = this.queryForm.value.aggFun;
    metric.downsample.interpolation = this.queryForm.value.interpolation;
    metric.downsample.sample_time = this.queryForm.value.sampleTime;
    metric.downsample.sample_time_unit = this.queryForm.value.sampleTimeUnit;
    pto.metrics.push(metric);

    let i = 0;
    const tag_filters = [];
    while (this.queryForm.contains(i + '_isGroupBy')) {
      const tag_filter = new TagFilter;
      tag_filter.value = this.queryForm.get(i + '_value').value;
      tag_filter.name = this.queryForm.get(i + '_name').value;
      tag_filter.type = this.queryForm.get(i + '_type').value;
      tag_filter.group = this.queryForm.get(i + '_isGroupBy').value;
      tag_filters.push(tag_filter);
      i++;
    }
    // 此处假设只存在1个metric。当存在多个metric时，以上表单结构需重构，需使用FormArray而不是FormControl
    pto.metrics[0].tag_filters = tag_filters;
      console.log('查询面板pto提交！',
        // pto
      );
    this.queryService.query(this.tsdbId, pto).subscribe(response => {
      const message = this.nzMessage.loading('正在查询中', { nzDuration: 0 }).messageId;
      if (this.queryService.validateResponseCode(response.code)) {
        const timestemps = [];
        const timestempsString = [];
        for (const item in response.result.xaxis.data) {
          if (response.result.xaxis.data.hasOwnProperty(item)) {
            timestemps.push(new Date(response.result.xaxis.data[item] * 1000));
            const year = new Date(response.result.xaxis.data[item] * 1000).getFullYear().toString();
            const month = new Date(response.result.xaxis.data[item] * 1000).toJSON().split('-')[1].toString();
            let date = new Date(response.result.xaxis.data[item] * 1000).getDate().toString();
            if (date.length === 1) {
              date = '0' + date;
            }
            let h = new Date(response.result.xaxis.data[item] * 1000).getHours().toString();
            let m = new Date(response.result.xaxis.data[item] * 1000).getMinutes().toString();
            let s = new Date(response.result.xaxis.data[item] * 1000).getSeconds().toString();
            if (h.length === 1) {
              h = '0' + h;
            }
            if (m.length === 1) {
              m = '0' + m;
            }
            if (s.length === 1) {
              s = '0' + s;
            }
            // const time = new Date(response.result.xaxis.data[item] * 1000).toString();
            timestempsString.push(year + '-' + month + '-' + date
            + ' ' + h + ':' + m + ':' + s
            );
          }
        }
        this.nzMessage.remove(message);
        this.nzMessage.success(response.message);
        this.isChartVisible = true;
      const titles = [];
      for (let i = 0; i < response.result.series.length; i++) {
        titles.push(response.result.series[i].name);
      }
      this.queryEchartOption = {
        height: '280',
        color: ['#69c7f7', '#95c16e', '#f8b551', '#CDAD00'],
        legend: {
          data: titles,
          y: 'bottom',
          padding: 10
        },
        grid: {
          left: '50',
          right: '50',
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: { color: '#e9e9e9' },
            animation: false
          }
        },
        xAxis: {
          type: response.result.xaxis.type,
          // type: 'time',
          name: '时间',
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
            // interval: 0,
            color: '#5a5a5a'
          },
          axisLine: {
            lineStyle: {
              color: '#919191'
            }
          },
          data: timestempsString
        },
        yAxis: {
          type: response.result.yaxis.type,
          name: '度量值',
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
          min: null,
        },
        series: response.result.series
      };
      for (let i = 0; i < this.queryEchartOption.series.length; i++) {
        this.queryEchartOption.series[i].smooth = true;
      }
    } else {
        this.queryEchartOption = {
          // tooltip: { trigger: 'axis' },
          // color: ['#CDAD00'],
          // legend: { data: ['数据查询结果'] },
          // xAxis: { type: response.result.xaxis.type, data: timestempsString },
          // yAxis: { type: response.result.yaxis.type },
          // series: response.result.series
      };
      this.nzMessage.remove(message);
      this.nzMessage.warning(response.message);
      }
      // this.queryService.downloadPto(pto);
      // this.queryService.downloadPto(response.result);
      console.log(
        // this.queryEchartOption,
        '数据查询生成图表！'
      // , response
      );
    });
  }

  addQueryModal(): void {
    this.modalService.create({
      nzTitle: '编辑查询条件',
      nzContent: QueryFormComponent,
      nzOnOk: (componentInstance) => {
        if (componentInstance.queryForm.valid) {
          return componentInstance.submit();
        } else {
          this.nzMessage.error('输入参数不合法，请重新输入！');
          return false;
        }
      },
      nzOnCancel: () => console.log('取消')
    });
  }

}


