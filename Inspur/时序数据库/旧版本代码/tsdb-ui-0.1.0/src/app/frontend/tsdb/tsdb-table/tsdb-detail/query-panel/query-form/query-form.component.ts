import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, MaxLengthValidator} from '@angular/forms';
import { QueryService } from '../../../../query.service';
import { NziModalService } from 'ng-zorro-iop';
import { NzMessageService } from 'ng-zorro-antd';
// import { metrics, tags, cities } from '../../../../consts';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css']
})
export class QueryFormComponent implements OnInit {
  @Input() template: any;
  @Input() tsdbId: string;

  metrics: any[];
  tagK: any[];
  tagV: any[] = [];
  cities: any[];

  groupByTags = [];
  filters = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;
  queryForm: FormGroup;
  submitTemp: any;
  isSpinning = false;

  submit() {
      for (const i in this.queryForm.controls) {
        if (this.queryForm.controls.hasOwnProperty(i)) {
          this.queryForm.controls[i].markAsDirty();
          this.queryForm.controls[i].updateValueAndValidity();
        }
      }
      const tagFilters = [];
      let i1 = 0;
      while (this.queryForm.get('tag_name_' + i1) !== null) {
        if (!this.queryForm.get('tag_group_' + i1).value) {
          tagFilters.push({
            name: this.queryForm.get('tag_name_' + i1).value,
            type: this.queryForm.get('tag_type_' + i1).value,
            value: this.queryForm.get('tag_value_' + i1).value,
            group: this.queryForm.get('tag_group_' + i1).value
          });
        }
        i1++;
      }
      this.submitTemp = {
        active: false,
        metric: this.queryForm.get('metric').value,
        aggFunc: this.queryForm.get('aggFunc').value,
        downSamplingFunc: this.queryForm.get('downSamplingFunc').value,
        downSamplingInterval: this.queryForm.get('downSamplingInterval').value,
        id: this.queryForm.get('id').value,
        isDownSampling: this.queryForm.get('isDownSampling').value,
        templateName: this.queryForm.get('templateName').value,
        groupBy: this.queryForm.get('groupBy').value,
        tags: tagFilters,
        timeRange: this.queryForm.get('timeRange').value
      };
  }

  constructor( private fb: FormBuilder, private queryService: QueryService, private nzMessageService: NzMessageService) {
    this.queryForm = this.fb.group({
      // timeRange: [[new Date(1420041600000), new Date(1451491200000)], [Validators.required]],
      timeRange: [[], [Validators.required]],
      templateName: [null, [Validators.required, this.templateNameValidator, Validators.minLength(2), Validators.maxLength(128)]],
      metric: [null, [Validators.required]],
      aggFunc: ['avg', [Validators.required]],
      groupBy: [null],
      isDownSampling: [false, [Validators.required]],
      downSamplingFunc: [null],
      downSamplingInterval: [null],
      id: [null]
    });
  }

  templateNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (!(/^[a-z][a-z0-9-,._]*$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  getMetrics(e: any) {
    this.isSpinning = true;
    this.queryService.getMetricList(this.tsdbId).subscribe(
      (response: any) => {
        this.metrics = response.result.data;

        // 控制台信息
        console.log('获取metrics！' + response.statusText + response.status);
      });
      this.queryService.getTagK(this.tsdbId, e).subscribe(
        (response: any) => {
        this.isSpinning = false;
        this.tagK = response.result.data;

        // 控制台信息
        console.log('获取tagK！' + response.statusText + response.status);
        }
      );
  }

  getTagV(metric: string, tagK: string, i: number) {
    this.isSpinning = true;
    this.queryService.getTagV(this.tsdbId, metric, String(tagK)).subscribe(
      (response: any) => {
        this.isSpinning = false;
        this.tagV[Number(i)] = response.result.data;
        this.queryForm.get(this.filters[i].value).setValue(null);

      // 控制台信息
      console.log('获取tagV!' + response.statusText + response.status);
      }
    );
  }

  log(i: any) {
    console.log(i, this.filters[i], this.tagV[i], this.queryForm.get(this.filters[i].value).value);
  }

  handleClose(removedTag: {}): void {
    this.groupByTags = this.groupByTags.filter(tag => tag !== removedTag);
  }

  addTag(tagName: string): void {
    if (tagName !== null) {
      this.groupByTags.push(tagName);
    }
  }

  addFilter(e?: MouseEvent) {
    if (this.metrics.length > 0) {
      if (e) {
        e.preventDefault();
      }
      const id = (this.filters.length > 0) ? this.filters[this.filters.length - 1].id + 1 : 0;
      const tagFilter = {
        id: id,
        name: 'tag_name_' + id,
        type: 'tag_type_' + id,
        value: 'tag_value_' + id,
        group: 'tag_group_' + id
      };
      const index = this.filters.push(tagFilter);
      this.queryForm.addControl(this.filters[index - 1].name, new FormControl(null));
      this.queryForm.addControl(this.filters[index - 1].type, new FormControl(null));
      this.queryForm.addControl(this.filters[index - 1].value, new FormControl(null));
      this.queryForm.addControl(this.filters[index - 1].group, new FormControl(null));
    } else {
      this.nzMessageService.warning('请先选择度量！');
    }
  }

  removeFilter(tag: any, e: MouseEvent, i: number) {
    e.preventDefault();
    const index = this.filters.indexOf(tag);
    this.filters.splice(index, 1);
    this.queryForm.removeControl(tag.name);
    this.queryForm.removeControl(tag.type);
    this.queryForm.removeControl(tag.value);
    this.queryForm.removeControl(tag.group);
    if (this.tagV[i] !== undefined) {
      for (let i2 = i; i2 < this.tagV[i].length; i2++ ) {
        this.tagV[i2] = this.tagV[i2 + 1];
      }
    }
  }

  downSampleSwitch(e: MouseEvent) {
    if (e) {
      this.queryForm.get('downSamplingFunc').setValidators([Validators.required]);
      this.queryForm.get('downSamplingInterval').setValidators([Validators.required]);
    } else {
      this.queryForm.get('downSamplingFunc').setValidators([]);
      this.queryForm.get('downSamplingInterval').setValidators([]);
    }
  }

  ngOnInit(): void {
    if (this.template !== undefined ) {
        this.queryForm.get('id').setValue(this.template.id);
        this.queryForm.get('timeRange').setValue([this.template.timeRange[0], this.template.timeRange[1]]);
        this.queryForm.get('metric').setValue(this.template.metric);
        this.getMetrics(this.queryForm.get('metric').value);
        // this.getTagK(this.queryForm.get('metric').value);
        this.queryForm.get('aggFunc').setValue(this.template.aggFunc);
        this.queryForm.get('templateName').setValue(this.template.templateName);
        for (let i = 0; i < this.template.tags.length; i++) {
          const tagFilter = {
            id: i,
            name: 'tag_name_' + i,
            type: 'tag_type_' + i,
            value: 'tag_value_' + i,
            group: 'tag_group_' + i
          };
          this.filters.push(tagFilter);
          this.queryForm.addControl('tag_name_' + i, new FormControl(this.template.tags[i].name));
          this.queryForm.addControl('tag_type_' + i, new FormControl(this.template.tags[i].type));
          this.queryForm.addControl('tag_value_' + i, new FormControl(this.template.tags[i].value));
          this.queryForm.addControl('tag_group_' + i, new FormControl(this.template.tags[i].group));
        }
        this.queryForm.get('groupBy').setValue(this.template.groupBy);
        this.queryForm.get('isDownSampling').setValue(this.template.isDownSampling);
        if (this.template.isDownSampling) {
          // if (this.template.downSamplingInterval === null || this.template.downSamplingFunc === null) {
          //   // 当打开降采样，但无降采样参数传入时，设定默认参数
          //   this.queryForm.get('downSamplingFunc').setValue('count');
          //   this.queryForm.get('downSamplingInterval').setValue('1440');
          // } else {
            this.queryForm.get('downSamplingFunc').setValue(this.template.downSamplingFunc);
            this.queryForm.get('downSamplingInterval').setValue(this.template.downSamplingInterval.toString());
          // }
        } else {
          this.queryForm.get('downSamplingFunc').setValue(null);
          this.queryForm.get('downSamplingInterval').setValue(null);
        }
    } else {
      this.queryService.getMetricList(this.tsdbId).subscribe(
        (response: any) => {
          this.metrics = response.result.data;
        // 控制台信息
        console.log('获取metrics!' + response.statusText + response.status);
        });
    }
  }
}
