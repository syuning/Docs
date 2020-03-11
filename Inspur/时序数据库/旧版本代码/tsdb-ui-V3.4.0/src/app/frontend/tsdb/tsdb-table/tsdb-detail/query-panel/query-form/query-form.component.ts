import {Component, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { metrics, tags, cities } from '../../../../consts';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css']
})
export class QueryFormComponent {

  metrics = metrics;
  tags = tags;
  cities = cities;

  groupByTags = [];
  filters = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;
  queryForm: FormGroup;

  submit() {
      for (const i in this.queryForm.controls) {
        if (this.queryForm.controls.hasOwnProperty(i)) {
          this.queryForm.controls[i].markAsDirty();
          this.queryForm.controls[i].updateValueAndValidity();
        }
      }
  }

  constructor( private fb: FormBuilder, private nzMessage: NzMessageService) {
    this.queryForm = this.fb.group({
      startDate: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      templateName: [null, [Validators.required]],
      metric: [null, [Validators.required]],
      aggFunc: [null, [Validators.required]],
      groupBy: [null, [Validators.required]],
      downSampling: [null],
      downSamplingFunc: [null],
      downSamplingInterval: [null]
    });
  }

  handleClose(removedTag: {}): void {
    this.groupByTags = this.groupByTags.filter(tag => tag !== removedTag);
  }

  addTag(tag: string): void {
    this.groupByTags.push(tag);
  }

  addFilter(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const id = (this.filters.length > 0) ? this.filters[this.filters.length - 1].id + 1 : 0;
    const tagFilter = {
      id: id,
      name: id + '_name',
      type: id + '_type',
      value: id + '_value'
    };
    const index = this.filters.push(tagFilter);
    this.queryForm.addControl(this.filters[index - 1].name, new FormControl(null));
    this.queryForm.addControl(this.filters[index - 1].type, new FormControl(null));
    this.queryForm.addControl(this.filters[index - 1].value, new FormControl(null));
  }

  removeFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.filters.indexOf(i);
    this.filters.splice(index, 1);
    this.queryForm.removeControl(i.name);
    this.queryForm.removeControl(i.type);
    this.queryForm.removeControl(i.value);
  }
}
