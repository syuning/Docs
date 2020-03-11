import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClnJobService } from '../../../../cln-job.service';
import { QueryService } from '../../../../query.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timeUnitOptions } from '../../../../consts';

@Component({
  selector: 'app-cln-job-create',
  templateUrl: './cln-job-create.component.html',
  // styleUrls: ['./cln-job-create.component.css']
})
export class ClnJobCreateComponent implements OnInit {
  @Input() tsdbId: string;
  @Output() refreshJobList = new EventEmitter();
  clnJobForm: FormGroup;
  timeUnitOptions = timeUnitOptions;
  isAbsoluteTimeRange: boolean;
  isCreatingModalVisible = false;
  isCreatingConfirmLoading = false;
  metrics: any[];

  constructor(private fb: FormBuilder, private clnJobService: ClnJobService, private queryService: QueryService) {
    this.clnJobForm = this.fb.group({
      timeRangeType: [ 'All', [ Validators.required ]],
      absoluteTimeRange: [ [new Date(1420041600000), new Date(1451491200000)], [Validators.required]],
      metricName: [null, [Validators.required]],
    });
  }

  // metricValidator = (control: FormControl): {
  //   [s: string]: boolean
  // } => {
  //   if (!control.value) { // 不为空
  //     return {
  //       required: true
  //     };
  //   } else if (!(/^[a-z0-9.]+$/).test(control.value)) {
  //     return {
  //       invalid: true
  //     };
  //   }
  // }

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

  handleCreatingModalOk(): boolean {
    this.isCreatingConfirmLoading = true;
    this.submitCreatingForm();
    if (this.clnJobForm.valid) {
      this.submitCreatingForm();
      let start: Date;
      let end: Date;
      if (this.clnJobForm.get('timeRangeType').value === 'Absolute') {
        start = this.clnJobForm.get('absoluteTimeRange').value[0];
        end = this.clnJobForm.get('absoluteTimeRange').value[1];
      } else if (this.clnJobForm.get('timeRangeType').value === 'All') {
        start = new Date(0);
        end = new Date();
      }
      const pto = {
          'id': this.tsdbId,
          'metrics': [{
            'name': this.clnJobForm.get('metricName').value,
            'tagFilters': null
          }],
          'timeRange': {
            'start': start,
            'end': end,
            'type': 1
          }
        };
      this.clnJobService.cleanData(this.tsdbId, pto).subscribe( response => {

      // 控制台信息
      console.log('清理数据！' + response.statusText + response.status);

        return true;
      });
    } else {
      this.isCreatingConfirmLoading = false;
      return false;
    }
    return false;
  }

  getMetrics() {
    this.queryService.getMetricList(this.tsdbId).subscribe(
      (response: any) => {
        this.metrics = response.result.data;
      }
    );
  }

  resetCreatingModal() {
    this.clnJobForm.reset();
    this.isAbsoluteTimeRange = null;
  }

  ngOnInit() {
    this.getMetrics();
  }

  submit() {}
}
