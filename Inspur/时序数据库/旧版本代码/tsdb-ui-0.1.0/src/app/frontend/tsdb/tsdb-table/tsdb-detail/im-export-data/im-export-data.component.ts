import { Component, OnInit, AfterViewInit, TemplateRef, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl,  ValidationErrors } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NziModalService} from 'ng-zorro-iop/modal/nzi-modal.service';
import { NzModalRef } from 'ng-zorro-iop/modal/nzi-modal-ref.class';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@trident/shared';
import { TsdbService } from '../../../tsdb.service';
import { ImExportService } from '../../../im-export.service';
import 'rxjs/add/operator/switchMap';
import { filterTypes } from '../../../consts';

export class Task {
  create_time: number;
  data_points_num: number;
  encoding: string;
  error: string;
  failed_dps: number;
  file_path: string;
  file_type: string;
  id: string;
  last_update_time: number;
  name: string;
  status: string;
  tag_filters: any;
  tsdb_name: string;
  type: string;
}

@Component({
  selector: 'app-tsdb-ie-data',
  templateUrl: './im-export-data.component.html',
  styleUrls: ['./im-export-data.component.css']
})
export class ImExportComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  exportForm: FormGroup;
  tsdbId = this.activedRoute.snapshot.params['id'];
  id = this.activedRoute.snapshot.params['task_id'];
  detail: any = {};

  controlArray: Array < { id: number, controlInstance: string } > = [];

  taskList: Task[] = [];
  tagFilters = [];
  loading = false;
  isPage = true;

  // 分页使用的全局变量
  _current = 1; _pageSize = 10; _total = 20; _sortValue = 'descend';

  isExportModalVisible = false;
  isExportOkLoading = false;
  detailModal: NzModalRef;

  filterTypes = filterTypes;

  constructor(private activedRoute: ActivatedRoute, private message: MessageService,
    private modalService: NziModalService, private router: Router, private imExportService: ImExportService,
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
      console.log('表单不合法！');
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
    const mid = this.nzMessage.loading('正在导出中', {
      nzDuration: 0
    }).messageId;
    this.imExportService.exportData(this.tsdbId, exportPto).subscribe(response => {
      if (response.result !== undefined) {
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

      // 控制台信息
      console.log('导出数据！' + response.statusText + response.status);
    });
  }

  sampleData() {
    this.imExportService.getSampleData().subscribe(response => {
      const link = document.createElement('a');
      const blob = new Blob([response.body], { type: 'application/csv' });
      link.setAttribute('href', window.URL.createObjectURL(blob));
      // link.setAttribute('download', response.headers.get('Content-disposition').split('filename=')[1]); //后端命名文件名
      link.setAttribute('download', 'sampleData-' + new Date().getTime() + '.csv'); // 前端命名文件名
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 控制台信息
      console.log('下载示例数据！' + response.statusText + response.status);
    });
  }

  importSampleData(): boolean {
    this.loading = true;
    const mid = this.nzMessage.loading('正在导入中', {
      nzDuration: 0
    }).messageId;
    this.imExportService.importSampleData(this.tsdbId).subscribe(response => {
      this.nzMessage.remove(mid);
      // if (response.result !== undefined) {
      //   this.nzMessage.remove(mid);
      //   this.nzMessage.success(response.message);
      // } else {
      //   this.nzMessage.remove(mid);
      //   this.nzMessage.error(response.message);
      // }
      this.refreshData();
      // 控制台信息
      console.log('导入示例数据！' + response.statusText + response.status);
      return true;
    });
    this.loading = false;
    return false;
  }

  refreshData() {
    this.loading = true;
    this.tsdbService.getTaskList(this.tsdbId, 0, 99, 'import').subscribe( (response: any) => {
      if (response.result !== undefined) {
        this.loading = false;
        this.taskList = response.result.data;
        this._total = response.total;

        // 控制台信息
        console.log('刷新清理任务列表！' + response.statusText + response.status);

      } else {
        const task = {
          create_time: 1558003279974,
          data_points_num: 27375,
          encoding: 'UTF-8',
          error: '',
          failed_dps: -1,
          file_path: 'resources/sampleData',
          file_type: 'CSV',
          id: 'testTsdbId01',
          last_update_time: 1558003351397,
          name: '测试数据',
          status: 'SUCCESS',
          tag_filters: null,
          tsdb_name: '请求列表是空的我是假的只是测试用',
          type: null
        };
        this.taskList = [];
        this.loading = false;
      }
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

  showDetailModal(mTitle: TemplateRef<{}>, mContent: TemplateRef<{}>, mFooter: TemplateRef<{}>) {
    this.detailModal = this.modalService.create({
      nzTitle: mTitle,
      nzContent: mContent,
      nzFooter: mFooter,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: 700,
      nzOnOk: () => this.detailModal.destroy()
    });
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
