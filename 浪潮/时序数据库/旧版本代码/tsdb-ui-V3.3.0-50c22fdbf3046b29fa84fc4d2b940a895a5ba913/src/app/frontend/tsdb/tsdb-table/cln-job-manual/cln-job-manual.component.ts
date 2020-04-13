import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClnJobService } from '../../cln-job.service';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
registerLocaleData(zh);

@Component({
  selector: 'app-cln-job-manual',
  templateUrl: './cln-job-manual.component.html',
  // styleUrls: ['./cln-job-manual.component.css']
})
export class ClnJobManualComponent implements OnInit {

  cleanJobsManual = [];
  creatingForm: FormGroup;
  loading = false;
  tagFilters = [];
  filterTypes = [{
      label: 'LITERAL_OR',
      value: 'literal_or'
    }, {
      label: 'ILITERAL_OR',
      value: 'iliteral_or'
    },
    {
      label: 'NOT_LITERAL_OR',
      value: 'not_literal_or'
    }, {
      label: 'NOT_ILITERAL_OR',
      value: 'not_iliteral_or'
    },
    {
      label: 'WILDCARD',
      value: 'wildcard'
    }, {
      label: 'IWILDCARD',
      value: 'iwildcard'
    }, {
      label: 'REGEXP',
      value: 'regexp'
    }
  ];
  tsdbId = this.activedRoute.snapshot.params['id'];
  isAbsoluteTimeRange: boolean;

  isCreatingModalVisible = false;
  isCreatingConfirmLoading = false;

  constructor(private activedRoute: ActivatedRoute, private fb: FormBuilder,
    private nzMessage: NzMessageService, private clnJobService: ClnJobService) {}

  ngOnInit() {
    this.getManualClnJobList();
    this.creatingForm = this.fb.group({
      jobName: ['', [Validators.required]],
      timeRangeType: ['All', [Validators.required]], // All 和 Absolute
      timeRange: [ [] ],
      metricName: [ '', [Validators.required, Validators.maxLength(50)] ]
    });
  }

  metricValidator = (control: FormControl): {
    [s: string]: boolean
  } => {
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

  getManualClnJobList(): void {
    this.clnJobService.getManualClnJobList(this.tsdbId, 0, 99).subscribe(
      (response: any) => {
        if (this.clnJobService.validateResponseCode(response.code)) {
          console.log('获取数据清理任务列表！'
          // , response
          );
          this.cleanJobsManual = response.result.data;
        } else {
          console.log('获取数据清理任务列表错误！'
          // , response
          );
        }
      });
  }

  createManualClnJob(): void {
    console.log('提交表单：'
    , this.creatingForm.value
    );
    let i = 0;
    let tag_filters = null;
    if (this.creatingForm.get(i + '_name') !== null) {
      tag_filters = [];
      while (this.creatingForm.get(i + '_name') !== null) {
        tag_filters.push({
          name: this.creatingForm.get(i + '_name').value,
          type: this.creatingForm.get(i + '_type').value,
          value: this.creatingForm.get(i + '_value').value
        });
        i++;
      }
    }
    const pto = {
      'id': this.tsdbId,
      'metrics': [{
        'name': this.creatingForm.get('metricName').value,
        'tag_filters': tag_filters
      }],
      'name': this.creatingForm.get('jobName').value,
      'time_range': {
        'start': this.creatingForm.get('timeRange').value[0],
        'end': this.creatingForm.get('timeRange').value[1],
        'type': 1
      }
    };
    if (this.creatingForm.get('timeRangeType').value === 'All') {
      pto.time_range.start = new Date(0);
      pto.time_range.end = new Date();
    }
    // console.log('提交内容：'
    // // , pto
    // );
    this.clnJobService.cleanDataManual(this.tsdbId, pto).subscribe(
      (response: any) => {
        console.log('数据清理！'
        // , response
        );
        const message = this.nzMessage.loading('正在创建中', {
          nzDuration: 0
        }).messageId;
        if (this.clnJobService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          console.log(this.creatingForm.value);
          this.creatingForm = this.fb.group({
            jobName: ['', [Validators.required]],
            timeRangeType: ['All', [Validators.required]], // All 和 Absolute
            timeRange: [ [] ],
            metricName: [ '', [Validators.required, Validators.maxLength(50)] ]
          });
          console.log(this.creatingForm.value);
          this.creatingForm.get('timeRangeType').setValue('All');
          this.getManualClnJobList();
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
        }
      }
    );
  }

  timeRangeTypeChange(timeRangeType: string): void {
    this.isAbsoluteTimeRange = (timeRangeType === 'Absolute' ? true : false);
  }

  addTagFilter(e ? : MouseEvent) {
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
    this.creatingForm.addControl(this.tagFilters[index - 1].isGroupBy, new FormControl(null));
    this.creatingForm.addControl(this.tagFilters[index - 1].name, new FormControl(null));
    this.creatingForm.addControl(this.tagFilters[index - 1].type, new FormControl(null));
    this.creatingForm.addControl(this.tagFilters[index - 1].value, new FormControl(null));
  }

  removeTagFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.tagFilters.indexOf(i);
    this.tagFilters.splice(index, 1);
    this.creatingForm.removeControl(i.isGgroupBy);
    this.creatingForm.removeControl(i.name);
    this.creatingForm.removeControl(i.type);
    this.creatingForm.removeControl(i.value);
  }

  submitCreatingForm(): FormGroup {
    for (const i in this.creatingForm.controls) {
      if (this.creatingForm.controls.hasOwnProperty(i)) {
        this.creatingForm.controls[i].markAsDirty();
        this.creatingForm.controls[i].updateValueAndValidity();
      }
    }
    return this.creatingForm;
  }

  handleCreatingModalOk(): void {
    this.submitCreatingForm();
    // console.log('当前表单内容：', this.submitCreatingForm());
    if (this.creatingForm.valid) {
      const pto = {
        // this.creatingForm.get('metricName').value
        'metrics': [{
          'agg_func': 'string',
          'downsample': {
            'interpolation': 'string',
            'name': 'string',
            'percentile': 0,
            'sample_time': 0,
            'sample_time_unit': 'string'
          },
          'name': this.creatingForm.get('metricName').value,
          'tag_filters': [{
            'group': true,
            'name': 'string',
            'type': 'string',
            'value': {}
          }]
        }],
        'resolution': '*placeholder*',
        'time_range': {
          'end': {},
          'start': {},
          'type': 0,
          'typeName': 'string'
        }
      };
      this.isCreatingConfirmLoading = true;
      setTimeout(() => {
        this.isCreatingModalVisible = false;
        this.isCreatingConfirmLoading = false;
      }, 3000);
      this.resetCreatingModal();
    } else {
      this.nzMessage.error('输入参数不合法，请输入正确格式的参数！');
    }
  }

  resetCreatingModal() {
    this.creatingForm.reset();
    this.isAbsoluteTimeRange = null;
  }

}
