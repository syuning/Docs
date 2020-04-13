import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@trident/shared';
import { NzMessageService } from 'ng-zorro-antd';
import { NziModalService} from 'ng-zorro-iop/modal/nzi-modal.service';
import { ClnJobCreateComponent } from '../tsdb-detail/cln-job/cln-job-create/cln-job-create.component';
import { ClnJobComponent } from '../tsdb-detail/cln-job/cln-job.component';
import { TsdbService } from '../../tsdb.service';
import { BssService } from '../../bss.service';
import { CookiesService } from 'ng-zorro-iop';
import 'rxjs/add/operator/switchMap';
import { ClnJobService } from '../../cln-job.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ImExportComponent } from './im-export-data/im-export-data.component';
import { TsdbMonitorComponent } from './tsdb-monitor/tsdb-monitor.component';
import { UserComponent } from './user/user.component';
import { QueryPanelComponent } from './query-panel/query-panel.component';

@Component({
  selector: 'app-tsdb-detail',
  templateUrl: './tsdb-detail.component.html',
  styleUrls: ['./tsdb-detail.component.css']
})
export class TsdbDetailComponent implements OnInit {

  @ViewChild(ClnJobComponent)
  clnJobComponent: ClnJobComponent;

  @ViewChild(ImExportComponent)
  imExportComponent: ImExportComponent;

  @ViewChild(QueryPanelComponent)
  queryPanelComponent: QueryPanelComponent;

  @ViewChild(TsdbMonitorComponent)
  tsdbMonitorComponent: TsdbMonitorComponent;

  @ViewChild(UserComponent)
  userComponent: UserComponent;

  loading = true;
  tsdbId = this.activedRoute.snapshot.params['id'];
  tabIndex = this.activedRoute.snapshot.params['tabIndex'];
  userId = this.userService.getUserId();
  detail: any = {};
  tsdbName: string;
  editable = false;
  submitValue;
  hasError = false;
  error = null;
  runningTime;
  retainIsInt = false;


  // 数据时效
  autoClnJobForm: FormGroup;
  isJobExist = false;
  isAutoModalVisible = false;
  isAutoModalConfirmLoading = false;

  constructor(private activedRoute: ActivatedRoute, private tsdbService: TsdbService, private clnJobService: ClnJobService,
    private nzMessage: NzMessageService, private bssService: BssService, private userService: UserService,
    private cookiesService: CookiesService, private modalService: NziModalService, private router: Router,
    private fb: FormBuilder) {}

  visibleChange() {
    this.submitValue = '';
    this.hasError = false;
    this.error = null;
  }
  valid(value) {
    if (!value) {
      this.hasError = true;
      this.error = {
        required: true
      };
      return false;
    } else if (value.match(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]{2,127}$/) == null) { // TSDB名称校验
      this.hasError = true;
      this.error = {
        patten: true
      };
      return false;
    } else {
      this.submitValue = value;
      this.hasError = false;
      this.error = null;
      return true;
    }
  }
  modelChange(value) {
    this.valid(value);
  }
  submit(value) {
    if (!this.hasError) {
      if (!this.submitValue || this.submitValue === value) {
        this.hasError = true;
        this.error = {
          noChange: true
        };
        this.editable = false;
      } else {
        this.editable = false;
        if (this.detail.status === 'RUNNING') {
          const mid = this.nzMessage.loading('正在修改中', { nzDuration: 0 }).messageId;
          this.tsdbService.editTsdbName(this.tsdbId, this.submitValue).subscribe(response => {
              this.nzMessage.remove(mid);
              this.nzMessage.success('更新时序数据库名称成功！');
            this.getData(this.tsdbId);

            // 控制台信息
            console.log('修改TSDB名称！' + response.statusText + response.status);
          });
        } else {
          this.nzMessage.error('时序数据库状态不可用，无法更新时序数据库名称！');
        }
      }
    }
  }
  getData(id: string) {
    this.loading = true;
    this.tsdbService.getIndividualTsdb(id).subscribe(response => {
      if (response.status === 200) {
        this.detail = response.body.result;
        this.tsdbName = response.body.result.name;
        const createTime = new Date(response.body.result.createTime);
        const now = new Date();
        const ms = (now.valueOf() - createTime.valueOf()); // 毫秒
        if (ms <= 60 * 60 * 1000) { // 一小时以下： xx分钟
          this.runningTime = Math.floor(ms / 1000 / 60) + '分钟';
        } else if ((ms > 60 * 60 * 1000) && (ms <= 60 * 60 * 1000 * 24)) { // 一天以下： xx小时xx分钟
          const h = Math.floor(ms / 1000 / 60 / 60);
          const m = Math.floor((ms - h * 1000 * 60 * 60) / 1000 / 60);
          this.runningTime = h + '小时' + m + '分钟';
        } else if (ms > 60 * 60 * 1000 * 24) { // 高于一天：xx天xx小时xx分钟
          const d = Math.floor(ms / 1000 / 60 / 60 / 24);
          const h = Math.floor((ms - d * 1000 * 60 * 60 * 24) / 1000 / 60 / 60); // 小时
          const m = Math.floor((ms - d * 1000 * 60 * 60 * 24 - h * 1000 * 60 * 60) / 1000 / 60);
          this.runningTime = d + '天' + h + '小时' + m + '分钟';
        }
        this.loading = false;
      } else {
        this.nzMessage.error('详情获取失败！', response.statusText);
      }

      // 控制台信息
      console.log('获取TSDB详情！' + response.statusText + response.status);

      this.loading = false;
    });
  }

  refresh() {
    this.getData(this.tsdbId); // 详情
    this.clnJobComponent.getClnJobList(); // 数据清理列表
    this.imExportComponent.refreshData(); // 数据导入列表
    this.queryPanelComponent.getTemplateList(); // 模板列表
    this.tsdbMonitorComponent.initCharts(); // 监控
    this.userComponent.getUserList(); // 用户列表
  }

  // 数据清理
  addClnJobModal(): void {
    this.modalService.create({
      nzTitle: '清理数据',
      nzContent: ClnJobCreateComponent,
      nzComponentParams: {tsdbId: this.tsdbId},
      nzOnOk: (componentInstance) => {
        if (componentInstance.clnJobForm.valid) {
          componentInstance.submitCreatingForm();
          componentInstance.handleCreatingModalOk();
          setTimeout(() => {
            this.clnJobComponent.getClnJobList();
            this.loading = false;
            return true;
          }, 1000);
        } else {
          componentInstance.submitCreatingForm();
          // this.nzMessage.error('输入参数不合法，请重新输入！');
          return false;
        }
      },
      nzOnCancel: () => console.log('取消')
    });
  }

  // 数据时效
  createAutoClnJobModal(): void {
    this.getAutoClnJob();
    this.isAutoModalVisible = true;
  }

  getAutoClnJob() {
    this.autoClnJobForm.reset();
    this.clnJobService.getAutoCleanJob(this.tsdbId).subscribe (response => {
      if (response.result) {
        this.isJobExist = true;
        this.loading = false;
        this.isAutoModalConfirmLoading = false;
        this.autoClnJobForm.get('autoClnSwitch').setValue(true);
        this.autoClnJobForm.get('retain').setValue(response.result.retain);
      }
    });
  }

  handleAutoClnJobModalOk() {
    if (this.autoClnJobForm.valid) {
      this.isAutoModalConfirmLoading = true;
      if (this.autoClnJobForm.get('autoClnSwitch').value) {
        if (!this.isJobExist) {
          this.clnJobService.addAutoCln(this.tsdbId, this.autoClnJobForm.get('retain').value).subscribe(response => {
            setTimeout(() => {
              this.isAutoModalVisible = false;
              this.isAutoModalConfirmLoading = false;
            }, 700);

            // 控制台信息
            console.log('开启自动清理任务！' + response.statusText + response.status);
          });
        } else {
          this.clnJobService.editAutoCln(this.tsdbId, this.autoClnJobForm.get('retain').value).subscribe(response => {
            setTimeout(() => {
              this.isAutoModalVisible = false;
              this.isAutoModalConfirmLoading = false;
            }, 700);

            // 控制台信息
            console.log('编辑自动清理任务！' + response.statusText + response.status);
          });
        }
      } else {
        this.clnJobService.deleteAutoClnJob(this.tsdbId).subscribe(response => {
          this.isJobExist = false;
          setTimeout(() => {
            this.isAutoModalVisible = false;
            this.isAutoModalConfirmLoading = false;
          }, 700);

          // 控制台信息
          console.log('关闭自动清理任务！' + response.statusText + response.status);
        });
      }
    } else {
      this.submitClnJobForm();
      return false;
    }
  }

  handleAutoClnJobModalCancel() {
    this.getAutoClnJob();
    this.isAutoModalVisible = false;
  }

  showDeleteTsdbModal(data: any) {
    this.modalService.delete({
      nzTitle: '删除时序数据库',
      nzContentTitle: `确定删除时序数据库<em> " ` + data.name + ` " </em>吗？`,
      nzContent: '删除数据不可恢复与访问，请谨慎操作！',
      // 删除（释放）成功的时序数据库将会停止计费，未删除（释放）的时序数据库会继续计费。
      nzOnOk: () => this.deleteTsdb(data) ,
      nzOnCancel: () => console.log('取消')
    });
  }

  deleteTsdb(tsdbPto: any): void {
    if (tsdbPto.status === 'CREATE_FAILED') {
      const message = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
      this.tsdbService.deleteTsdb(tsdbPto.id).subscribe(response => {
        this.navToHomePage();
        this.nzMessage.remove(message);
        // if (response.result !== undefined) {
        //   this.nzMessage.remove(message);
        //   this.nzMessage.success(response.message);
        // } else {
        //   this.nzMessage.remove(message);
        //   this.nzMessage.error(response.message);
        // }
      });
    } else {
      const uuid = require('uuid/v4');
      const pto = this.bssService.generateTsdbOrderPto(this.userId, this.cookiesService.getCookie('inspur_token'), uuid(),
       tsdbPto.billMode, 'unsubscribe', 0, 0, 'M', false, null, tsdbPto.region, 1, tsdbPto.wrt_dp_pers, tsdbPto.storage_size,
       tsdbPto.id);
      // this.tsdbService.downloadPto(pto);
      const mid = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
      this.bssService.unsubscribeProduct(pto).subscribe(response => {
        if (response.code === '0') {
          this.nzMessage.remove(mid);
          this.nzMessage.success('时序数据库退订成功！');
          setTimeout(() => {this.navToHomePage(); console.log('延时刷新！'); }, 3000);
        }
        
        // 控制台信息
        console.log('提交退订订单！' + response.statusText + response.status);
      });
    }
  }

  navToHomePage() {
    this.router.navigateByUrl('/tsdb/list');
  }

  ngOnInit() {
    this.getData(this.tsdbId);
    this.autoClnJobForm = this.fb.group({
      autoClnSwitch: [false, [Validators.required]],
      retain: [null, [Validators.required, this.retainValidator]]
      });
}

retainValidator = (control: FormControl): { [s: string]: boolean } => {
  if (!(/^\d+$/).test(control.value)) {
    return {
      invalid: true
    };
  }
}

submitClnJobForm(): void {
  for (const key in this.autoClnJobForm.controls) {
    if (this.autoClnJobForm.controls.hasOwnProperty(key)) {
      this.autoClnJobForm.controls[key].markAsDirty();
      this.autoClnJobForm.controls[key].updateValueAndValidity();
    }
  }
}
}
