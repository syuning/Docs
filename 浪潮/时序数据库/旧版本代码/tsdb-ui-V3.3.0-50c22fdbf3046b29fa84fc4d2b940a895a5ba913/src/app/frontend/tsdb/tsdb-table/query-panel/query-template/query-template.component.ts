import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, FormArray, AbstractControl } from '@angular/forms';
import { TagFilter } from '../query-panel.component';
import { QueryService } from '../../../query.service';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-query-template',
  templateUrl: './query-template.component.html',
  styleUrls: ['./query-template.component.css']
})
export class QueryTemplateComponent implements OnInit {
  editTemplateForm: FormGroup;
  templateName: string;
  tsdbId = this.activedRoute.snapshot.params['id'];
  loading = false;

  templates = [
    {
    create_time: '2019-01-17T03:15:44Z',
    down_sampling: {
      agg_func: 'avg',
      interpolation: 'none',
      sample_interval: {
        unit: 'h',
        value: '1'
      }
    },
    id: '8a8136cd68371550016859ceae690f66',
    metric: 'temperature',
    name: 'template1',
    tag_filters: [{
        isGroupBy: true,
        value: 'v1',
        type: 'literal_or',
        name: 'n1'
      },
      {
        isGroupBy: true,
        value: 'v2',
        type: 'wildcard',
        name: 'n2'
      }
    ]
  }];
  tagFilters: any;
  tagFiltersToBeEdited: any;
  filterTypes = [
    {
      label: 'LITERAL_OR',
      value: 'literal_or'
    },
    {
      label: 'ILITERAL_OR',
      value: 'iliteral_or'
    },
    {
      label: 'NOT_LITERAL_OR',
      value: 'not_literal_or'
    },
    {
      label: 'NOT_ILITERAL_OR',
      value: 'not_iliteral_or'
    },
    {
      label: 'WILDCARD',
      value: 'wildcard'
    },
    {
      label: 'IWILDCARD',
      value: 'iwildcard'
    },
    {
      label: 'REGEXP',
      value: 'regexp'
    }
  ];
  aggFuns = [
    {
    label: 'AVG',
    value: 'avg'
  },
  {
    label: 'COUNT',
    value: 'count'
  },
  {
    label: 'DEV',
    value: 'dev'
  },
  {
    label: 'FIRST',
    value: 'first'
  },
  {
    label: 'LAST',
    value: 'last'
  },
  {
    label: 'MAX',
    value: 'max'
  },
  {
    label: 'MIN',
    value: 'min'
  },
  {
    label: 'SUM',
    value: 'sum'
  }
];
  interpolations = [
    {
      label: 'None',
      value: 'none'
    },
    {
      label: 'NaN',
      value: 'nan'
    },
    {
      label: 'Null',
      value: 'null'
    },
    {
      label: 'Zero',
      value: 'zero'
    }
  ];
  timeUnitOptions = [
    {
      label: '小时',
      value: 'h'
    },
    {
      label: '分钟',
      value: 'm'
    },
    {
      label: '天',
      value: 'd'
    },
    {
      label: '周',
      value: 'w'
    },
    {
      label: '月',
      value: 'n'
    },
    {
      label: '年',
      value: 'y'
    },
    {
      label: '秒',
      value: 's'
    },
    {
      label: '毫秒',
      value: 'ms'
    }
  ];

  isEditTemplateModalVisible = false;
  isEditTemplateConfirmLoading = false;

  constructor(private fb: FormBuilder, private queryService: QueryService,
    private activedRoute: ActivatedRoute, private nzMessage: NzMessageService) {
    this.editTemplateForm = this.fb.group({
      templateName: [null, [Validators.required, this.templateNameValidator]],
      metricName: ['', [Validators.required, Validators.maxLength(50)]],
      aggFun: ['', [Validators.required] ],
      interpolation: ['', [Validators.required] ],
      sampleTime: ['', [Validators.required] ],
      sampleTimeUnit: ['', [Validators.required] ],
      templateId: ['']
      // tagFilters: new FormArray([])
    });

  }

  ngOnInit() {
    this.getTemplateList();
  }


  metricValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return { required: true };
    } else if ( !(/^[a-z0-9.]+$/).test(control.value)) {
        return { invalid: true };
    }
    }

    templateNameValidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) { // 不为空
        return { required: true };
      } else if ( !(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]+$/).test(control.value)) {
          return { required: false, invalid: true };
      }
      }

  getTemplateList() {
    this.loading = true;
    this.queryService.getTemplateList('', this.tsdbId, 0, 99).subscribe(
      (response: any) => {
        console.log('刷新模板列表！'
        // , response
        );

        this.templates = response.result.data;
        this.loading = false;
      });
  }

  editTemplate(templateId: string) {
    if (this.editTemplateForm.valid) {
      this.submitEditTemplateForm();
      let index = 0;
      const tagFilters = [];
      while (this.editTemplateForm.get(index + '_name') !== null) {
        tagFilters.push({
          group: this.editTemplateForm.get(index + '_isGroupBy').value,
          type: this.editTemplateForm.get(index + '_type').value,
          name: this.editTemplateForm.get(index + '_name').value,
          value: this.editTemplateForm.get(index + '_value').value,
        });
        index++;
      }
      const pto = {
        // create_time: '2019-01-17T03:15:44Z',
        down_sampling: {
          agg_func: this.editTemplateForm.get('aggFun').value,
          interpolation: this.editTemplateForm.get('interpolation').value,
          sample_interval: {
            unit: this.editTemplateForm.get('sampleTimeUnit').value,
            value: this.editTemplateForm.get('sampleTime').value
          }
        },
        id: templateId,
        metric: this.editTemplateForm.get('metricName').value,
        name: this.editTemplateForm.get('templateName').value,
        tags: tagFilters
      };
      // console.log('编辑模板！', pto);
      this.queryService.editTemplate(this.tsdbId, this.editTemplateForm.get('templateId').value, pto).subscribe(response => {
        console.log('编辑模板！'
        // , pto, response
        );
        const message = this.nzMessage.loading('正在编辑中', { nzDuration: 0 }).messageId;
        if (this.queryService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          setTimeout(() => {
            this.isEditTemplateModalVisible = false;
            this.isEditTemplateModalVisible = false;
          }, 1000);
          let i = 0;
          while (this.editTemplateForm.get(i + '_name') !== null) {
            this.editTemplateForm.removeControl(i + '_isGroupBy');
            this.editTemplateForm.removeControl(i + '_type');
            this.editTemplateForm.removeControl(i + '_name');
            this.editTemplateForm.removeControl(i + '_value');
            i++;
          }
          this.getTemplateList();
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message); }
      });
    } else {
      this.nzMessage.error('输入的参数不合法，请重新输入！');
    }
  }

  submitEditTemplateForm() {
    for (const key in this.editTemplateForm.controls) {
      if (this.editTemplateForm.controls.hasOwnProperty(key)) {
        this.editTemplateForm.controls[key].markAsDirty();
        this.editTemplateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  removeTemplate(templateId: string) {
    const mid = this.nzMessage.loading('正在删除中', {
      nzDuration: 0
    }).messageId;
    this.queryService.deleteTemlate(this.tsdbId, templateId).subscribe(response => {
      console.log('删除模板！'
      // , response
      );
      if (this.queryService.validateResponseCode(response.code)) {
        this.nzMessage.remove(mid);
        this.nzMessage.success(response.message);
        this.getTemplateList();
      } else {
        this.nzMessage.remove(mid);
        this.nzMessage.error(response.message);
      }
    });
  }

  showEditTemplateModal(templatePto: any) {
    this.editTemplateForm.setValue({
      templateName: templatePto.name,
      metricName: templatePto.metric,
      aggFun: templatePto.down_sampling.agg_func,
      interpolation: templatePto.down_sampling.interpolation,
      sampleTime: templatePto.down_sampling.sample_interval.value,
      sampleTimeUnit: templatePto.down_sampling.sample_interval.unit,
      templateId: templatePto.id
    });

    if (templatePto.tags !== null) {
      this.tagFiltersToBeEdited = templatePto.tags;
      for (let i = 0; i < templatePto.tags.length; i++) {
      this.editTemplateForm.addControl( i + '_isGroupBy', new FormControl(templatePto.tags[i].groupBy));
      this.editTemplateForm.addControl( i + '_type', new FormControl(templatePto.tags[i].type));
      this.editTemplateForm.addControl( i + '_name', new FormControl(templatePto.tags[i].name));
      this.editTemplateForm.addControl( i + '_value', new FormControl(templatePto.tags[i].value));
      }
    }
    this.isEditTemplateModalVisible = true;
  }

  // handleEditTemplateModalOk(templateId: string): void {
  //   this.editTemplate(templateId);
  // }

  handleEditTemplateModalCancel(): void {
    this.isEditTemplateModalVisible = false;
    let i = 0;
    while (this.editTemplateForm.get(i + '_name') !== null) {
      this.editTemplateForm.removeControl(i + '_isGroupBy');
      this.editTemplateForm.removeControl(i + '_type');
      this.editTemplateForm.removeControl(i + '_name');
      this.editTemplateForm.removeControl(i + '_value');
      i++;
    }
  }

}
