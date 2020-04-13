import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@trident/shared';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TsdbService } from '../../tsdb.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-tsdb-detail',
  templateUrl: './tsdb-detail.component.html',
  // styleUrls: ['./tsdb-detail.component.css']
})
export class TsdbDetailComponent implements OnInit {
  loading = true;
  tsdbId = this.activedRoute.snapshot.params['id'];
  detail: any = {};
  runningTime: any;

  editable = false;
  submitValue;
  hasError = false;
  error = null;
  data;

  constructor(private activedRoute: ActivatedRoute, private message: MessageService,
    private tsdbService: TsdbService, private nzMessage: NzMessageService) {}

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
      } else {
        // this.data.name = this.submitValue;
        this.editable = false;
        const mid = this.nzMessage.loading('正在修改中', {
          nzDuration: 0
        }).messageId;
        this.tsdbService.editTsdbName(this.tsdbId, this.submitValue).subscribe(response => {
          console.log('修改TSDB！'
          // , response
          );
          if (this.tsdbService.validateResponseCode(response.code)) {
            this.nzMessage.remove(mid);
            this.nzMessage.success(response.message);
            this.getData(this.tsdbId);
          } else {
            this.nzMessage.remove(mid);
            this.nzMessage.error(response.message);
          }
        });
      }
    }
  }
  getData(id) {
    this.tsdbService.getIndividualTsdb(id).subscribe(response => {
      this.detail = response.result;
      const createTime = new Date(response.result.create_time);
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
      console.log('获取TSDB详情！'
      // , response
      );
      this.loading = false;
    });
  }

  ngOnInit() {
    this.getData(this.tsdbId);
  }
}
