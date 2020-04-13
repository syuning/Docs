import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NziModalService } from 'ng-zorro-iop';
import { QueryService } from '../../../query.service';
import { QueryFormComponent } from '../query-panel/query-form/query-form.component';
import { aggFuns, interpolations, filterTypes, timeUnitOptions, metrics, tags } from '../../../consts';

export class QueryPto {
  timeRange: TimeRange;
  metric: Metric;
  templateName: string;
  id: string;
  isDownSample: boolean;
}

export class TimeRange {
  type: number;
  start: any;
  end: any;
}

export class Metric {
  name: string;
  aggFunc: string;
  downSampling: DownSample;
  tagFilters: TagFilter[];
}

export class DownSample {
  aggFunc: string;
  sampleTime: string;
  sampleTimeUnit: string;
  interpolation: string;
}

export class TagFilter {
  group: boolean;
  type: string;
  name: string;
  value: string;
}

export class Template {
  active: boolean;

  timeRange: Date[];

  tags: TagFilter[];

  groupBy: any[];

  metric: string;
  aggFunc: string;

  templateName: string;
  id: string;

  isDownSampling: boolean;
  downSamplingFunc: string;
  downSamplingInterval: string;
}

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css']
})
export class QueryPanelComponent implements OnInit {
  @ViewChild('customTpl') customTpl: TemplateRef<any>;

  // 常量
  filterTypes = filterTypes;
  aggFuns = aggFuns;
  interpolations = interpolations;
  timeUnitOptions = timeUnitOptions;
  metrics = metrics;
  tags = tags;

  // 模板列表
  templates = [];
  cover = false;

  isFormLoading = false;
  isChartLoading = false;
  isChartVisible = false;
  queryEchartOption = null;
  firstLoad = true;

  tsdbId = this.activedRoute.snapshot.params['id'];

  constructor( private activedRoute: ActivatedRoute, private fb: FormBuilder,
    private nzMessage: NzMessageService, private queryService: QueryService,
    private modalService: NziModalService) {}

  ngOnInit() {
    this.getTemplateList();
  }

  getTemplateList() {
    this.isFormLoading = true;
    this.queryService.getTemplateList(this.tsdbId).subscribe( (response: any) => {
        this.isFormLoading = false;
        this.templates = [];
        const result = response.body.result; // 响应体内的模板列表
        for (let i = 0; i < result.total; i++) {
          const temp = result.data[i]; // 遍历响应体模板列表
          const groupBy = [];
          let active = false;
          if (i === 0) {
            active = true;
          }
          const tagFilters = [];
          if (temp.metric.tagFilters !== null) {
            for (let i2 = 0; i2 < temp.metric.tagFilters.length; i2++) {
              if (temp.metric.tagFilters[i2].groupBy === true) {
                groupBy.push(temp.metric.tagFilters[i2].name);
              } else {
                let tagV = [];
                for (let i0 = 0; i0 < temp.metric.tagFilters[i2].value.length; i0++) {
                  tagV = temp.metric.tagFilters[i2].value.split('|');
                }
                tagFilters.push({
                  name: temp.metric.tagFilters[i2].name,
                  value: tagV,
                  type: temp.metric.tagFilters[i2].type,
                  group: false
                });
              }
            }
          }
          const template: Template = {
            timeRange: [new Date(temp.timeRange.start), new Date(temp.timeRange.end)],
            metric: temp.metric.name,
            aggFunc: temp.metric.aggFunc,
            templateName: temp.name,
            id: temp.id,
            tags: tagFilters,
            groupBy: groupBy,
            isDownSampling: temp.isDownSample,
            downSamplingFunc: temp.metric.downSampling === undefined ? null : temp.metric.downSampling.aggFunc,
            downSamplingInterval: temp.metric.downSampling === undefined ? null : String(temp.metric.downSampling.sampleTime),
            active: active
          };
          this.templates.push(template);
        }
        if (this.templates.length !== 0 && this.firstLoad) {
          this.createLineChart(this.templates[0]);
          this.firstLoad = false;
        }

        // 控制台信息
        console.log('刷新模板列表！' + response.statusText + response.status);
      });
  }

  useTemplate(e: boolean, template: Template) {
    if (e) {
      this.createLineChart(template);
      console.log(
        '使用模版', template.templateName,
      // template
      );
    }
  }

  changeParam(e: boolean, template: any) {
    if (e && template.timeRange !== null && template.timeRange.length !== 0) {
      this.createLineChart(template);
    } else {
      console.log('表单不合法');
    }
  }

  createLineChart(template: any) {
    // console.log(template);
    this.isFormLoading = true;
    const pto = new QueryPto;
    const timeRange = new TimeRange;
    const metric = new Metric;
    const downSampling = new DownSample;

    // 1 Absolute time , 2 Relative time
    // 时间范围 timeRange
    timeRange.start = new Date(template.timeRange[0]);
    timeRange.end = new Date(template.timeRange[1]);
    timeRange.type = 1;
    pto.timeRange = timeRange;

    metric.name = template.metric;
    metric.aggFunc = template.aggFunc;
    pto.metric = metric;

    pto.templateName = template.templateName;
    pto.id = template.id;

    // 降采样
    pto.isDownSample = template.isDownSampling;
    downSampling.aggFunc = template.downSamplingFunc;
    downSampling.interpolation = 'none';
    downSampling.sampleTime = template.downSamplingInterval;
    downSampling.sampleTimeUnit = 'm';
    metric.downSampling = downSampling;

    pto.metric.tagFilters = [];
    if (template.groupBy !== null) {
      // 从groupBy中提取tagFilter
      for (let i1 = 0; i1 < template.groupBy.length; i1++) {
        const tagFilter: TagFilter = {
          group: true,
          type: 'wildcard',
          name: template.groupBy[i1],
          value: '*'
        };
        pto.metric.tagFilters.push(tagFilter);
      }
    }

    if (template.tags !== null) {
      // 从tags中提取tagFilter
      for (let i2 = 0; i2 < template.tags.length; i2++) {
        let tagV = '';
        for (let i3 = 0; i3 < template.tags[i2].value.length; i3++) {
          tagV += template.tags[i2].value[i3];
          if (i3 < template.tags[i2].value.length - 1) {
            tagV += '|';
          }
        }
        const tagFilter: TagFilter = {
          group: false,
          type: 'literal_or',
          name: template.tags[i2].name,
          value: tagV
        };
        pto.metric.tagFilters.push(tagFilter);
      }
    }

    console.log('查询传参'
    , pto
    );
    this.queryService.query(this.tsdbId, pto).subscribe(response => {
      this.isFormLoading = false;
      // const message = this.nzMessage.loading('正在查询中', { nzDuration: 0 }).messageId;
      if (response.result !== undefined) {
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
        this.isChartVisible = true;
      const titles = [];
      for (let i1 = 0; i1 < response.result.series.length; i1++) {
        titles.push(response.result.series[i1].name);
      }
      this.queryEchartOption = {
        height: '400',
        color: ['#69c7f7', '#95c16e', '#f8b551', '#CDAD00'],
        // legend: {
        //   data: titles,
        //   y: 'bottom',
        //   padding: 0
        // },
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
      for (let i3 = 0; i3 < this.queryEchartOption.series.length; i3++) {
        this.queryEchartOption.series[i3].smooth = true;
      }
    } else {
        this.isChartVisible = false;
        this.queryEchartOption = {};
      // this.nzMessage.warning(response.message);
      }
      this.getTemplateList();

      // 控制台信息
      console.log('数据查询生成图表！' + response.statusText + response.status);
    });
  }

  addTemplateModal(): void {
    this.modalService.create({
      nzTitle: '添加查询条件',
      nzContent: QueryFormComponent,
      nzComponentParams: {
        tsdbId: this.tsdbId
      },
      nzMaskClosable: false,
      nzWidth: 700,
      nzOnOk: (componentInstance) => {
        if (componentInstance.queryForm.valid) {
          componentInstance.submit();
          this.createLineChart(componentInstance.submitTemp);
          console.log('创建模板'
          // , componentInstance.submitTemp
           );
          return;
        } else {
          componentInstance.submit();
          this.nzMessage.error('输入参数不合法，请重新输入！');
          return false;
        }
      },
      nzOnCancel: () => console.log('取消')
    });
  }

  editTemplateModal(template: Template): void {
    if (!template) {
      template = this.templates[0];
    }
    this.modalService.create({
      nzTitle: '编辑查询条件',
      nzContent: QueryFormComponent,
      nzComponentParams: {
        template: template,
        tsdbId: this.tsdbId
      },
      nzMaskClosable: false,
      nzWidth: 700,
      nzOnOk: (componentInstance) => {
        if (componentInstance.queryForm.valid) {
          componentInstance.submit();
          this.createLineChart(componentInstance.submitTemp);
          console.log('编辑模板'
          // , componentInstance.submitTemp
           );
          return;
        } else {
          componentInstance.submit();
          this.nzMessage.error('输入参数不合法，请重新输入！');
          return false;
        }
      },
      nzOnCancel: () => console.log('取消')
    });
  }

  showDeleteConfirm(template: any): void {
  if (!template) {
    template = this.templates[0];
  }
    this.modalService.delete({
      nzTitle: '删除查询模板',
      nzContentTitle: '确定删除模版<em>“' + template.templateName + '”</em>吗？',
      nzContent: '删除数据不可恢复与访问，请谨慎操作！',
      // nzOkType: 'danger',
      nzOnOk: () => {
        this.isFormLoading = true;
        this.queryService.deleteTemplate(this.tsdbId, template.id).subscribe( response => {
          this.getTemplateList();

          // 控制台信息
          console.log('删除模版！' + response.statusText + response.status);
        });
      },
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
