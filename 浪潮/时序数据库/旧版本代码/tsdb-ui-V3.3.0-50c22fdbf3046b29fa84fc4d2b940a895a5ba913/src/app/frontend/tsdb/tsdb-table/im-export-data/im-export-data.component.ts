import { Component, OnInit, AfterViewInit, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl,  ValidationErrors } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@trident/shared';
import { TsdbService } from '../../tsdb.service';
import { ImExportService } from '../../im-export.service';
import 'rxjs/add/operator/switchMap';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-tsdb-ie-data',
  templateUrl: './im-export-data.component.html'
})
export class ImExportComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  exportForm: FormGroup;

  controlArray: Array < {
    id: number,
    controlInstance: string
  } > = [];

  tsdbId = this.activedRoute.snapshot.params['id'];

  data: Element[] = [];
  tagFilters = [];
  loading = false;
  isPage = true;

  // 分页使用的全局变量
  _current = 1; _pageSize = 10; _total = 20; _sortValue = 'descend';

  isExportModalVisible = false;
  isExportOkLoading = false;

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

  constructor(private activedRoute: ActivatedRoute, private message: MessageService,
    private modalService: NzModalService, private router: Router, private imExportService: ImExportService,
    private fb: FormBuilder, private tsdbService: TsdbService, private nzMessage: NzMessageService) {
    this.exportForm = this.fb.group({
      exportPath: ['', [Validators.required]],
      metricName: ['', [Validators.required, Validators.maxLength(50)]],
      timeRange: [
        [],
        [Validators.required]
      ]
    });
  }

  showExportModal() {
    this.isExportModalVisible = true;
  }

  handleExportOk(): void {
    if (this.exportForm.valid) {
      this.isExportOkLoading = true;
      window.setTimeout(() => {
        this.isExportOkLoading = false;
      }, 3000);
      this.submitForm();
      this.exportData();
    } else {
      console.log('表单不合法');
    }
  }

  handleExportCancel(): void {
    this.isExportModalVisible = false;
    this.exportForm.reset();
  }

  exportData() {
    this.loading = true;
    const tags = [];
    let index = 0;
    while (this.exportForm.contains(index + '_name')) {
      tags.push({
        'name': this.exportForm.get(index + '_name').value,
        'type': this.exportForm.get(index + '_type').value,
        'value': this.exportForm.get(index + '_value').value,
      });
      index++;
    }
    const exportPto = {
      'exportPath': this.exportForm.get('exportPath').value,
      'metricName': this.exportForm.get('metricName').value,
      'timeRange': {
        'start': this.exportForm.get('timeRange').value[0],
        'end': this.exportForm.get('timeRange').value[1]
      },
      'tag_filters': tags
    };
    // console.log('表单内容：'
    // , this.exportForm.value
    // );
    // console.log('提交内容：'
    // , exportPto
    // );
    const mid = this.nzMessage.loading('正在导出中', {
      nzDuration: 0
    }).messageId;
    this.imExportService.exportData(this.tsdbId, exportPto).subscribe(response => {
      console.log('导出数据'
      // , response
      );
      if (this.imExportService.validateResponseCode(response.code)) {
        this.nzMessage.remove(mid);
        this.nzMessage.success(response.message);
        this.isExportModalVisible = false;
        this.loading = false;
        return true;
      } else {
        this.nzMessage.remove(mid);
        this.nzMessage.error(response.message);
      }
      this.refreshData();
    });
  }

  sampleData() {
    this.imExportService.getSampleData().subscribe(response => {
      console.log('下载示例数据'
      // , response
      );
      const link = document.createElement('a');
      const blob = new Blob([response.body], { type: 'application/csv' });
      link.setAttribute('href', window.URL.createObjectURL(blob));
      // link.setAttribute('download', response.headers.get('Content-disposition').split('filename=')[1]); //后端命名文件名
      link.setAttribute('download', 'sampleData-' + new Date().getTime() + '.csv'); // 前端命名文件名
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  importSampleData(): boolean {
    this.loading = true;
    const mid = this.nzMessage.loading('正在导入中', {
      nzDuration: 0
    }).messageId;
    this.imExportService.importSampleData(this.tsdbId).subscribe(response => {
      console.log('导入示例数据'
      // , response
      );
      if (this.imExportService.validateResponseCode(response.code)) {
        this.nzMessage.remove(mid);
        this.nzMessage.success(response.message);
        this.refreshData();
        return true;
      } else {
        this.nzMessage.remove(mid);
        this.nzMessage.error(response.message);
      }
    });
    this.loading = false;
    return false;
  }

  refreshData() {
    this.loading = true;
    this.tsdbService.getTaskList(this.tsdbId, 'IMPORT', 0, 99).subscribe(
      (response: any) => {
        this.loading = false;
        this.data = response.result.data || [];
        this._total = response.total;
        console.log('刷新清理任务列表！'
        // , this.data, response
        );
      });
  }

  addTagFilter(e ?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const id = (this.tagFilters.length > 0) ? this.tagFilters[this.tagFilters.length - 1].id + 1 : 0;

    const tagFilter = {
      id: id,
      value: id + '_value',
      type: id + '_type',
      name: id + '_name',
      groupBy: id + '_true'
    };
    const index = this.tagFilters.push(tagFilter);
    this.exportForm.addControl(this.tagFilters[index - 1].value, new FormControl(null));
    this.exportForm.addControl(this.tagFilters[index - 1].type, new FormControl(null));
    this.exportForm.addControl(this.tagFilters[index - 1].name, new FormControl(null));
  }

  removeTagFilter(i, e: MouseEvent) {
    e.preventDefault();
    const index = this.tagFilters.indexOf(i);
    this.tagFilters.splice(index, 1);
    this.exportForm.removeControl(i.value);
    this.exportForm.removeControl(i.type);
    this.exportForm.removeControl(i.name);
  }

  submitForm(): void {
    for (const key in this.exportForm.controls) {
      if (this.exportForm.controls.hasOwnProperty(key)) {
        this.exportForm.controls[key].markAsDirty();
        this.exportForm.controls[key].updateValueAndValidity();
      }
    }
  }

  ngOnInit() {
    this.refreshData();
  }

  ngOnChanges() {}

  ngAfterViewInit() {
    // this.send(true);
  }

  ngOnDestroy() {
    // this.send(false);
  }

}
