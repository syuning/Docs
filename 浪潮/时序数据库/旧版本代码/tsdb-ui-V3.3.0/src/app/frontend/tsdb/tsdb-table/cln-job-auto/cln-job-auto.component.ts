import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClnJobService } from '../../cln-job.service';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
registerLocaleData(zh);

@Component({
  selector: 'app-cln-job-auto',
  templateUrl: './cln-job-auto.component.html',
  // styleUrls: ['./cln-job-auto.component.css']
})
export class ClnJobAutoComponent implements OnInit {

  clnJobForm: FormGroup;
  clnJobEditForm: FormGroup;
  isEditingModalVisible = false;
  autoClnJobName = '';
  tsdbId = this.activedRoute.snapshot.params['id'];
  loading = false;
  isButtonLoading = false;

  tagFilters = [];
  tagFiltersEdited = [];
  filterTypes = [{
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
  cleanJobsAuto = [{
    clnJobName: '假数据1',
    cronExpression: '0/59 * * * * ?',
    metrics: {
      aggregator: '',
      name: 'temperature',
      tag_filters: [{
          group: true,
          name: 's',
          type: 'literal_or',
          value: '1'
        },
        {
          group: true,
          name: 'dsf',
          type: 'literal_or',
          value: '2'
        }
      ]
    },
    retain: '45',
    timeUnit: 'MONTH',
    tsdbName: 'xry5wk'
  }];

  constructor(private fb: FormBuilder, private modalService: NzModalService,
    private activedRoute: ActivatedRoute, private clnJobService: ClnJobService, private nzMessage: NzMessageService) {}

  ngOnInit() {
    this.clnJobForm = this.fb.group({
      jobName: ['', [Validators.required, this.jobNameValidator, Validators.minLength(2), Validators.maxLength(128)]],
      timeUnit: ['MONTH', [Validators.required]],
      retain: ['', [Validators.required, this.retainValidator]],
      cronExpression: ['', [Validators.required, this.cronExpressionValidator]],
      metricName: ['', [Validators.required, Validators.maxLength(50)]]
    });
    this.clnJobEditForm = this.fb.group({
      jobName: [{
          value: null,
          disabled: true
        },
        [Validators.required]
      ],
      timeUnit: [null, [Validators.required]],
      retain: [null, [Validators.required, this.retainValidator]],
      cronExpression: [null, [Validators.required, this.cronExpressionValidator]],
      metricName: ['', [Validators.required, Validators.maxLength(50)]]
    });
    this.getAutoClnJobList();
  }

  jobNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return {
        required: true
      };
    } else if (!(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]+$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  retainValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return {
        required: true
      };
    } else if (!(/^[1-9]\d*$/).test(control.value)) {
      if (!(/^([1-9][0-9]*){1,3}$/).test(control.value)) {
        if (!(/^\+?[1-9][0-9]*$/).test(control.value)) {
          return {
            invalid: true
          };
        }
      }
    }
  }

  cronExpressionValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return {
        required: true
      };
    } else {
      const cron = control.value.split(' ');
      const second = cron[0];
      const minute = cron[1];
      const hour = cron[2];
      const day = cron[3];
      const month = cron [4];
      const week = cron[5];
      const year = cron[6];
      if (
        second === undefined || (!(/[0-9*,-/$\x22]/).test(second) ||
        minute === undefined || (!(/[0-9*,-/$\x22]/).test(minute)) ||
        hour === undefined || (!(/[0-9*,-/$\x22]/).test(hour)) ||
        day === undefined || (!(/[LWC0-9*?,-/$\x22]/).test(day)) ||
        month === undefined || (!(/[0-9*,-/$\x22]/).test(month)) ||
        week === undefined || (!(/[ADEFHIMNORSTUW0-9*?,-/$\x22]/).test(week)) ||
        year !== undefined && (!(/[0-9*,-/$\x22]/).test(year)) || (cron[7] !== undefined)
        )) {
        return { invalid: true };
      }
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

  getAutoClnJobList() {
    this.loading = true;
    this.clnJobService.getAutoClnJobList(this.autoClnJobName, this.tsdbId, 0, 99).subscribe(response => {
      this.cleanJobsAuto = response.result.data;
      console.log('刷新自动清理任务列表！'
      // , response
      );
      this.loading = false;
    });
  }

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

    this.clnJobForm.addControl(this.tagFilters[index - 1].isGroupBy, new FormControl(null));
    this.clnJobForm.addControl(this.tagFilters[index - 1].name, new FormControl(null));
    this.clnJobForm.addControl(this.tagFilters[index - 1].type, new FormControl(null));
    this.clnJobForm.addControl(this.tagFilters[index - 1].value, new FormControl(null));
  }

  removeTagFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.tagFilters.indexOf(i);
    this.tagFilters.splice(index, 1);
    this.clnJobForm.removeControl(i.isGroupBy);
    this.clnJobForm.removeControl(i.name);
    this.clnJobForm.removeControl(i.type);
    this.clnJobForm.removeControl(i.value);
  }

  submitclnJobForm(): FormGroup {
    for (const i in this.clnJobForm.controls) {
      if (this.clnJobForm.controls.hasOwnProperty(i)) {
        this.clnJobForm.controls[i].markAsDirty();
        this.clnJobForm.controls[i].updateValueAndValidity();
      }
    }
    return this.clnJobForm;
  }

  submitclnJobEditForm(): FormGroup {
    for (const i in this.clnJobEditForm.controls) {
      if (this.clnJobEditForm.controls.hasOwnProperty(i)) {
        this.clnJobEditForm.controls[i].markAsDirty();
        this.clnJobEditForm.controls[i].updateValueAndValidity();
      }
    }
    return this.clnJobEditForm;
  }

  createJob(): void {
    this.isButtonLoading = true;
    console.log('表单内容：'
    // , this.clnJobForm
    );
    if (this.clnJobForm.valid) {
      this.submitclnJobForm();
      const tag_filters = [];
      let index = 0;
      while (this.clnJobForm.get(index + '_name') !== null) {
        const tag_filter = {
          group: this.clnJobForm.get(index + '_isGroupBy').value,
          name: this.clnJobForm.get(index + '_name').value,
          type: this.clnJobForm.get(index + '_type').value,
          value: this.clnJobForm.get(index + '_value').value
        };
        tag_filters.push(tag_filter);
        index++;
      }
      const data = {
        clnJobName: this.clnJobForm.get('jobName').value,
        cronExpression: this.clnJobForm.get('cronExpression').value,
        metrics: [{
          name: this.clnJobForm.get('metricName').value,
          tag_filters: tag_filters
        }],
        retain: this.clnJobForm.get('retain').value,
        timeUnit: this.clnJobForm.get('timeUnit').value,
        tsdbName: this.tsdbId
      };
      const message = this.nzMessage.loading('正在创建中', {
        nzDuration: 0
      }).messageId;
      this.clnJobService.createAutoClnJob(this.tsdbId, data).subscribe(
        (response) => {
          this.isButtonLoading = false;
          if (this.clnJobService.validateResponseCode(response.code)) {
            this.nzMessage.remove(message);
            this.nzMessage.success(response.message);
            this.clnJobForm.reset();
            this.clnJobForm.get('timeUnit').setValue('MONTH');
            this.getAutoClnJobList();
          } else {
            this.nzMessage.remove(message);
            this.nzMessage.error(response.message);
          }
        }
      );

    } else {
      this.nzMessage.error('输入参数不合法，请输入正确格式的参数！');
    }
  }

  deleteJob(clnJobName: string) {
    const message = this.nzMessage.loading('正在删除中', {
      nzDuration: 0
    }).messageId;
    this.clnJobService.deleteAutoClnJob(this.tsdbId, clnJobName).subscribe(response => {
      console.log('删除任务！'
      // , response
      );
      if (this.clnJobService.validateResponseCode(response.code)) {
        this.nzMessage.remove(message);
        this.nzMessage.success(response.message);
        this.getAutoClnJobList();
      } else {
        this.nzMessage.remove(message);
        this.nzMessage.error(response.message);
      }
    });
  }

  showJobDeleteConfirm(clnJobName: string) {
    this.modalService.confirm({
      nzTitle: '确认删除该任务吗？',
      nzContent: '<b style="color: red;">该任务将无法恢复！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteJob(clnJobName),
      nzCancelText: '否',
      nzOnCancel: () => console.log('取消')
    });
  }

  getMetric(metrics: any) {
    return Object.values(metrics);
  }

  getValue(metric: any) {
    return metric.value;
  }

  showTerminatingModal(): void {

  }

  showEditingModal(data: any): void {
    console.log('编辑自动清理任务：'
    // , data
    );
    console.log('当前表单内容：'
    // , this.clnJobEditForm
    );
    this.clnJobEditForm.get('jobName').setValue(data.clnJobName);
    this.clnJobEditForm.get('timeUnit').setValue(data.timeUnit);
    this.clnJobEditForm.get('retain').setValue(data.retain);
    this.clnJobEditForm.get('cronExpression').setValue(data.cronExpression);
    this.clnJobEditForm.get('metricName').setValue(data.metrics[0].metric);
    if (data.metrics[0].filters) {
      this.tagFiltersEdited = data.metrics[0].filters;
      for (let i = 0; i < this.tagFiltersEdited.length; i++) {
        this.clnJobEditForm.addControl(i + '_isGroupBy', new FormControl(true));
        this.clnJobEditForm.addControl(i + '_name', new FormControl(this.tagFiltersEdited[i].tagk, Validators.required));
        this.clnJobEditForm.addControl(i + '_value', new FormControl(this.tagFiltersEdited[i].filter, Validators.required));
        this.clnJobEditForm.addControl(i + '_type', new FormControl(this.tagFiltersEdited[i].type, Validators.required));
      }

    }
    this.isEditingModalVisible = true;
  }

  handleEditingModalOk(): void {
    this.isButtonLoading = true;
    console.log('表单内容：'
    // , this.submitclnJobEditForm()
    );
    if (this.clnJobEditForm.valid) {
      this.submitclnJobEditForm();
      const message = this.nzMessage.loading('正在编辑中', {
        nzDuration: 0
      }).messageId;
      const tag_filters = [];
      let index = 0;
      while (this.clnJobEditForm.get(index + '_name') !== null) {
        const tag_filter = {
          group: this.clnJobEditForm.get(index + '_isGroupBy').value,
          name: this.clnJobEditForm.get(index + '_name').value,
          type: this.clnJobEditForm.get(index + '_type').value,
          value: this.clnJobEditForm.get(index + '_value').value
        };
        tag_filters.push(tag_filter);
        index++;
      }
      const pto = {
        clnJobName: this.clnJobEditForm.get('jobName').value,
        cronExpression: this.clnJobEditForm.get('cronExpression').value,
        metrics: [{
          name: this.clnJobEditForm.get('metricName').value,
          tag_filters: tag_filters
        }],
        retain: this.clnJobEditForm.get('retain').value,
        timeUnit: this.clnJobEditForm.get('timeUnit').value,
        tsdbName: this.tsdbId
      };
      this.clnJobService.updateAutoClnJob(this.tsdbId, pto).subscribe(response => {
        this.isButtonLoading = false;
        console.log('编辑任务请求返回结果：'
        // , response
        );
        if (this.clnJobService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          this.getAutoClnJobList();
          this.isEditingModalVisible = false;
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
          this.isEditingModalVisible = false;
        }
      });
      // setTimeout(() => {
      // }, 3000);
    } else {
      this.nzMessage.error('输入参数不合法，请输入正确格式的参数！');
    }
  }

  handleEditingModalCancel(): void {
    this.isButtonLoading = false;
    this.isEditingModalVisible = false;
  }

}

export class Filter {
  groupBy: boolean;
  tagK: string;
  type: string;
  filter: {};
}
