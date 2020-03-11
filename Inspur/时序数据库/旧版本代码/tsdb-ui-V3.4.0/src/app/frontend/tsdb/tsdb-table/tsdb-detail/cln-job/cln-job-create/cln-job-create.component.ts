import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClnJobService } from '../../../../cln-job.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timeUnitOptions } from '../../../../consts';

@Component({
  selector: 'app-cln-job-create',
  templateUrl: './cln-job-create.component.html',
  // styleUrls: ['./cln-job-create.component.css']
})
export class ClnJobCreateComponent implements OnInit {
  @Output() refreshJobList = new EventEmitter();
  clnJobForm: FormGroup;
  timeUnitOptions = timeUnitOptions;
  isAbsoluteTimeRange: boolean;
  isCreatingModalVisible = false;
  isCreatingConfirmLoading = false;

  constructor(private fb: FormBuilder, private clnJobService: ClnJobService) {
    this.clnJobForm = this.fb.group({
      timeRangeType: [ 'All', [ Validators.required ]],

      // 绝对时间选择
      absoluteTimeRange: [ [new Date(1420041600000), new Date(1451491200000)], [Validators.required]],

      // 相对时间选择
      // relativeStart: [1],
      // relativeStartUnit: ['h'],
      // relativeEnd: [0],
      // relativeEndUnit: ['h'],

      metricName: ['temperature', [Validators.required, Validators.maxLength(50)]],
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

  timeRangeTypeChange(timeRangeType: string): void {
    this.isAbsoluteTimeRange = (timeRangeType === 'Absolute' ? true : false);
  }

  submitCreatingForm(): FormGroup {
    for (const i in this.clnJobForm.controls) {
      if (this.clnJobForm.controls.hasOwnProperty(i)) {
        this.clnJobForm.controls[i].markAsDirty();
        this.clnJobForm.controls[i].updateValueAndValidity();
      }
    }
    return this.clnJobForm;
  }

  handleCreatingModalOk(tsdbId: string): boolean {
    this.isCreatingConfirmLoading = true;
    if (this.clnJobForm.valid) {
      this.submitCreatingForm();
      let start: Date;
      let end: Date;
      if (this.clnJobForm.get('timeRangeType').value === 'Absolute') {
        start = this.clnJobForm.get('absoluteTimeRange').value[0];
        end = this.clnJobForm.get('absoluteTimeRange').value[1];
      } else if (this.clnJobForm.get('timeRangeType').value === 'All') {
        start = new Date(946656000000);
        end = new Date();
      }
      const pto = {
          'id': tsdbId,
          'metrics': [{
            'name': this.clnJobForm.get('metricName').value,
            'tag_filters': null
          }],
          'time_range': {
            'start': start,
            'end': end,
            'type': 1
          }
        };
      this.clnJobService.cleanData(tsdbId, pto).subscribe( response => {
        console.log('清理数据！', this.clnJobForm.get('timeRangeType').value, response.message
                    // pto,
                    // response
                    );
        return true;
      });
    } else {
      this.isCreatingConfirmLoading = false;
      return false;
    }
    return false;
  }

  resetCreatingModal() {
    this.clnJobForm.reset();
    this.isAbsoluteTimeRange = null;
  }

  ngOnInit() {
  }

  submit() {}
}
