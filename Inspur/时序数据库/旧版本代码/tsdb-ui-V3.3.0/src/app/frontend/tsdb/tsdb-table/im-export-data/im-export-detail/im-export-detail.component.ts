import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@trident/shared';
import { TsdbService } from '../../../tsdb.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-ie-data-task-detail',
  templateUrl: './im-export-detail.component.html'
})
export class ImExportTaskDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  tsdbId = this.activedRoute.snapshot.params['id'];
  id = this.activedRoute.snapshot.params['task_id'];
  detail: any = {};

  constructor(private activedRoute: ActivatedRoute, private message: MessageService,
    private tsdbService: TsdbService) {}

  getTaskData(tsdbId: string, id: string) {
    this.tsdbService.getIndividualTask(tsdbId, id).subscribe(
      (response: any) => {
        this.detail = response.result || [];
        console.log('获取清理任务详情！'
        // , this.detail, response
        );
      });
  }

  // send(flag: boolean): void {
  //   if (flag) {
  //     this.message.sendMessage([{
  //         label: '数据库详情',
  //         link: '/tsdb/detail/' + this.tsdbId,
  //         icon: 'fa fa-list-alt'
  //       },
  //       {
  //         label: '查询面板',
  //         link: '/tsdb/query/' + this.tsdbId,
  //         icon: 'fa fa-clipboard'
  //       },
  //       /*{
  //         label: "监控",
  //         link: "/tsdb/monitor/"+ this.tsdbId
  //       },
  //       {
  //         label: "数据时效",
  //         link: "/tsdb/job/clean/"+ this.tsdbId
  //       },*/
  //       {
  //         label: '导入导出',
  //         link: '/tsdb/iedata/' + this.tsdbId,
  //         icon: 'fa fa-clipboard'
  //       },
  //       {
  //         label: '数据清理',
  //         link: '/tsdb/clean/' + this.tsdbId,
  //         icon: 'fa fa-users'
  //       },
  //       {
  //         label: '用户列表',
  //         link: '/tsdb/' + this.tsdbId + '/user/',
  //         icon: 'fa fa-users'
  //       }
  //     ]);
  //   } else {
  //     this.message.sendMessage(false);
  //   }
  // }

  ngOnInit() {
    this.getTaskData(this.tsdbId, this.id);
  }

  ngAfterViewInit() {
    // this.send(true);
  }

  ngOnDestroy() {
    // this.send(false);
  }
}
