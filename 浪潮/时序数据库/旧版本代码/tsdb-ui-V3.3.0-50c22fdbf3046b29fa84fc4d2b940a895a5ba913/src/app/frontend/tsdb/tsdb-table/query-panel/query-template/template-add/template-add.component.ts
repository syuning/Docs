import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { QueryService } from '../../../../query.service';

@Component({
  selector: 'app-template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-add.component.css']
})
export class TemplateAddComponent implements OnInit {
  @Output() updateTemplateList = new EventEmitter();
  @Output() updateTemplateNames = new EventEmitter();

  newTemplateForm: FormGroup;
  tsdbId = this.activedRoute.snapshot.params['id'];
  tagFilters = [];
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

  isCreatingTemplateModalVisible = false;
  isCreatingTemplateConfirmLoading = false;

  addTagFilter(e ?: MouseEvent) {

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

    this.newTemplateForm.addControl(this.tagFilters[index - 1].isGroupBy, new FormControl(false));
    this.newTemplateForm.addControl(this.tagFilters[index - 1].name, new FormControl(null));
    this.newTemplateForm.addControl(this.tagFilters[index - 1].type, new FormControl(null));
    this.newTemplateForm.addControl(this.tagFilters[index - 1].value, new FormControl(null));
  }

  removeTagFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.tagFilters.indexOf(i);
    this.tagFilters.splice(index, 1);
    this.newTemplateForm.removeControl(i.isGgroupBy);
    this.newTemplateForm.removeControl(i.name);
    this.newTemplateForm.removeControl(i.type);
    this.newTemplateForm.removeControl(i.value);
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
          return { invalid: true, required: false };
      }
      }

  submitCreateTemplateForm() {
      for (const key in this.newTemplateForm.controls) {
        if (this.newTemplateForm.controls.hasOwnProperty(key)) {
          this.newTemplateForm.controls[key].markAsDirty();
          this.newTemplateForm.controls[key].updateValueAndValidity();
        }
      }
  }

  showCreatingModal() {
    this.isCreatingTemplateModalVisible = true;
  }

  // handleCreateTemplateModalOk(): void {
  //   setTimeout(() => {
  //     this.isCreatingTemplateModalVisible = false;
  //     this.isCreatingTemplateConfirmLoading = false;
  //   }, 3000);
  // }

  createTemplate() {
    if (this.newTemplateForm.valid) {
      this.submitCreateTemplateForm();
      let index = 0;
      const tagFilters = [];
      while (this.newTemplateForm.get(index + '_name') !== null) {
        tagFilters.push({
          group: this.newTemplateForm.get(index + '_isGroupBy').value,
          type: this.newTemplateForm.get(index + '_type').value,
          name: this.newTemplateForm.get(index + '_name').value,
          value: this.newTemplateForm.get(index + '_value').value,
        });
        index++;
      }
      const pto = {
        // create_time: '2019-01-17T03:15:44Z',
        down_sampling: {
          agg_func: this.newTemplateForm.get('aggFun').value,
          interpolation: this.newTemplateForm.get('interpolation').value,
          sample_interval: {
            unit: this.newTemplateForm.get('sampleTimeUnit').value,
            value: this.newTemplateForm.get('sampleTime').value
          }
        },
        // id: this.tsdbId,
        metric: this.newTemplateForm.get('metricName').value,
        name: this.newTemplateForm.get('templateName').value,
        tags: tagFilters
      };
      // console.log('创建模板！', pto);
      this.queryService.createTemplate(this.tsdbId, pto).subscribe(response => {
        console.log('创建模板！'
        // , pto, response
        );
        const message = this.nzMessage.loading('正在创建中', { nzDuration: 0 }).messageId;
        if (this.queryService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          this.newTemplateForm.reset();
          this.isCreatingTemplateModalVisible = false;
          this.updateTemplateList.emit();
          this.updateTemplateNames.emit();
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message); }
      });
    } else {
      this.nzMessage.error('输入的参数不合法，请重新输入！');
    }
  }


  handleCreateTemplateModalCancel(): void {
    this.isCreatingTemplateModalVisible = false;
  }

  constructor(private queryService: QueryService, private fb: FormBuilder,
     private activedRoute: ActivatedRoute, private nzMessage: NzMessageService) { }

  ngOnInit() {
    this.newTemplateForm = this.fb.group({
      templateName: [null, [Validators.required, this.templateNameValidator, Validators.minLength(2), Validators.maxLength(128)]],
      metricName: ['', [Validators.required, Validators.maxLength(50)]],
      aggFun: ['', [Validators.required]],
      interpolation: ['', [Validators.required]],
      sampleTime: ['', [Validators.required]],
      sampleTimeUnit: ['', [Validators.required]]
    });
  }

}
