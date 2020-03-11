import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../../query.service';
import { QueryTemplateComponent } from './query-template/query-template.component';
import { TemplateAddComponent } from './query-template/template-add/template-add.component';
// import zh from '@angular/common/locales/zh';
// import {registerLocaleData} from '@angular/common';
// registerLocaleData(zh);

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css']
})
export class QueryPanelComponent implements OnInit {

  @ViewChild(QueryTemplateComponent) queryTemplate: QueryTemplateComponent;
  @ViewChild(TemplateAddComponent) addTemplate: TemplateAddComponent;

  index = 0;
  queryForm: FormGroup;
  templates = [];
  isTemplateUsed = false;

  tagFilters = [];
  tagFiltersEdited = [];
  filterTypes = [
    { label: 'LITERAL_OR', value: 'literal_or' },
    { label: 'ILITERAL_OR', value: 'iliteral_or' },
    { label: 'NOT_LITERAL_OR', value: 'not_literal_or' },
    { label: 'NOT_ILITERAL_OR', value: 'not_iliteral_or' },
    { label: 'WILDCARD', value: 'wildcard' },
    { label: 'IWILDCARD', value: 'iwildcard' },
    { label: 'REGEXP', value: 'regexp' }
  ];
  aggFuns = [
    { label: 'AVG', value: 'avg' },
    { label: 'COUNT', value: 'count' },
    { label: 'DEV', value: 'dev' },
    { label: 'FIRST', value: 'first' },
    { label: 'LAST', value: 'last' },
    { label: 'MAX', value: 'max' },
    { label: 'MIN', value: 'min' },
    { label: 'SUM', value: 'sum' }
  ];
  interpolations = [
    { label: 'None', value: 'none' },
    { label: 'NaN', value: 'nan' },
    { label: 'Null', value: 'null' },
    { label: 'Zero', value: 'zero' }
  ];
  timeUnitOptions = [
    { label: '小时', value: 'h' },
    { label: '分钟', value: 'm' },
    { label: '天', value: 'd' },
    { label: '周', value: 'w' },
    { label: '月', value: 'n' },
    { label: '年', value: 'y' },
    { label: '秒', value: 's' },
    { label: '毫秒', value: 'ms' }
  ];
  saveAsTemplate = false;

  isChartVisible = false;
  queryEchartOption = null;

  tsdbId = this.activedRoute.snapshot.params['id'];

  constructor( private activedRoute: ActivatedRoute, private fb: FormBuilder, private nzMessage: NzMessageService,
    private queryService: QueryService) {
    this.queryForm = this.fb.group({
      timeRangeType: [ 'Absolute', [ Validators.required ]],

      // 绝对时间选择
      absoluteTimeRange: [ '', [Validators.required]],

      // relativeTimeRange: [ '', ],

      // 相对时间选择
      relativeStart: [],
      relativeStartUnit: [],
      relativeEnd: [],
      relativeEndUnit: [],

      templateName: [ '', ],
      metricName: ['', [Validators.required, Validators.maxLength(50)]],
      aggFun: [ '', [ Validators.required ]],
      interpolation: [ '', [ Validators.required ]],
      sampleTime: [ '', [ Validators.required ]],
      sampleTimeUnit: [ '', [ Validators.required ]],
      saveAsTemplate: [ false, ],
      newTemplateName: [ ''],
    });
  }

  ngOnInit() {
    this.getTemplteNames();
  }

  changeTimeRangeType(timeRangeType: string) {
    // console.log(timeRangeType);
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

  templateNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if ( !(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]+$/).test(control.value)) {
        return { invalid: true };
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

  getTemplteNames() {
    this.queryService.getTemplateList('', this.tsdbId, 0, 10).subscribe(
      (response: any) => {
        console.log('获取模板名称列表！'
        // , response
        );
        this.templates = response.result.data;
      });
  }

  templateOption (template: any): void {
    if ((template !== '')) {
      this.useTemplate(template);
      return;
    } else {
      this.resetForm();
      return;
    }
  }

  useTemplate(template: any) {
    const temp = {
      templateName: template.name,
      metricName: template.metric,
      aggFun: template.down_sampling.agg_func,
      interpolation: template.down_sampling.interpolation,
      sampleTime: template.down_sampling.sample_interval.value,
      sampleTimeUnit: template.down_sampling.sample_interval.unit,
      tagFilters : template.tags
    };
    this.isTemplateUsed = true;
    this.tagFiltersEdited = temp.tagFilters;
    this.queryForm.get('metricName').setValue(temp.metricName);
    this.queryForm.get('aggFun').setValue(temp.aggFun);
    this.queryForm.get('interpolation').setValue(temp.interpolation);
    this.queryForm.get('sampleTime').setValue(temp.sampleTime);
    this.queryForm.get('sampleTimeUnit').setValue(temp.sampleTimeUnit);
    for (let i = 0; i < this.tagFiltersEdited.length; i++) {
      this.queryForm.addControl( i + '_name', new FormControl(this.tagFiltersEdited[i].name, Validators.required));
      this.queryForm.addControl( i + '_value', new FormControl(this.tagFiltersEdited[i].value, Validators.required));
      this.queryForm.addControl( i + '_type', new FormControl(this.tagFiltersEdited[i].type, Validators.required));
      this.queryForm.addControl( i + '_isGroupBy', new FormControl(this.tagFiltersEdited[i].groupBy, Validators.required));
    }
    console.log('使用模板：', temp);
  }

  getTemplate(templateName: string): any {
    const temp = {
      templateName: templateName,
      metricName: 'temperature',
      aggFun: 'AVG',
      interpolation: 'NONE',
      sampleTime: '60',
      sampleTimeUnit: 'HOUR',
      tagFilters : [
        {
        type: 'asd',
        name: 'tag1',
        isGroupBy: true,
        value: '111111'
        },
        {
          type: 'qdaefa',
          name: 'tag2',
          isGroupBy: true,
          value: 'dadadada'
          }
      ]
    };
    return temp;
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

  changeTemplateSavingStatus(value: string): void {
    this.saveAsTemplate = (value[0] === 'true' ? true : false);
    this.queryForm.value.saveAsTemplate = this.saveAsTemplate;
    if (value[0] === 'true') {
      this.queryForm.get('newTemplateName').setValidators([Validators.required, this.templateNameValidator, Validators.maxLength(128)])
    } else {
      this.queryForm.get('newTemplateName').setValidators([]);
    }
  }

  submitQueryForm() {
    for (const key in this.queryForm.controls) {
      if (this.queryForm.controls.hasOwnProperty(key)) {
        this.queryForm.controls[ key ].markAsDirty();
        this.queryForm.controls[ key ].updateValueAndValidity();
      }
    }
    // console.log('表单内容！', this.queryForm.value);
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
    pto.resolution = 's';

    // 1 Absolute time , 2 Relative time
    if (this.queryForm.value.timeRangeType === 'Absolute') {
      pto.time_range.type = 1;
    } else if (this.queryForm.value.timeRangeType === 'Relative') {
      pto.time_range.type = 2;
    } else {
      pto.time_range.type = 0;
    }
    // pto.time_range.type = this.queryForm.value.timeRangeType;
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
    if (this.queryForm.get('saveAsTemplate').value) {
      const template = new Template;
      template.metrics = pto.metrics;
      this.submitTemplate(template);
  }
      // console.log('查询面板参数：', pto);
    this.queryService.query(this.tsdbId, pto).subscribe(response => {
      const message = this.nzMessage.loading('正在查询中', { nzDuration: 0 }).messageId;
      if (this.queryService.validateResponseCode(response.code)) {
        const timestemps = []; const timestempsString = [];
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
        this.queryEchartOption = {
          tooltip: { trigger: 'axis' },
          color: ['#CDAD00'],
          legend: { data: ['每分写入数据点'] },
          xAxis: { type: response.result.xaxis.type, data: timestempsString },
          yAxis: { type: response.result.yaxis.type },
          series: [{data: response.result.series[0].data, type: response.result.series[0].type}]
      };
      // } else if (this.queryService.validateResponseCodeEmpty(response.code)) {
      //   this.nzMessage.remove(message);
      //   this.nzMessage.warning(response.message);
      } else {
      this.queryEchartOption = {
        // tooltip: { trigger: 'axis' },
        // color: ['#CDAD00'],
        // legend: { data: ['每分写入数据点'] },
        // xAxis: { type: 'category', data: [] },
        // yAxis: { type: 'value' },
        // series: [{data: [], type: 'line'}]
    };
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
      }
      console.log('查询面板请求'
      // , response
      );
    });
}

  submitTemplate(templatePto: any) {
    // 模板只保存查询参数的metric信息，此处假设只存在一组metric（即metric数组的长度为1）
    console.log('生成图表并保存为模板！'
    // , templatePto.metrics[0]
    );
    const pto = {
      down_sampling: {
        agg_func: templatePto.metrics[0].agg_func,
        interpolation: templatePto.metrics[0].downsample.interpolation,
        sample_interval: {
          unit: templatePto.metrics[0].downsample.sample_time_unit,
          value: templatePto.metrics[0].downsample.sample_time
        }
      },
      metric: templatePto.metrics[0].name,
      name: this.queryForm.get('newTemplateName').value,
      tags: templatePto.metrics[0].tag_filters
    };
    this.queryService.createTemplate(this.tsdbId, pto).subscribe(response => {
      console.log('生成图表并保存为模板！'
      // , response
      );
      const message = this.nzMessage.loading('正在查询中', { nzDuration: 0 }).messageId;
      if (this.queryService.validateResponseCode(response.code)) {
        this.nzMessage.remove(message);
        this.nzMessage.success(response.message);
      } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
      }
    });
    setTimeout(() => {
    this.queryTemplate.getTemplateList();
    this.getTemplteNames();
  }, 1000);
  }

}

export class  QueryPto {
  time_range: TimeRange;
  metrics: Metric[];
  resolution: string;
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
  metrics: Metric[];
}
