import { Component, OnInit } from '@angular/core';
import { TsdbService } from '../tsdb.service';
import { BssService } from '../bss.service';
import { UserService } from '@global/shared/user.service';

export class Resource {
  regionName: string;
  total: number;
  recentPurchase: number;
  running: number;
  expired: number;
  toBeExpired: number;
}

@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.css']
})
export class OutlineComponent implements OnInit {

  resourcesAll = new Resource;
  resourcesByRegions = [];
  regions = [];
  userId = this.userService.getUserId();
  isSpinning = false;

  constructor(private userService: UserService, private tsdbService: TsdbService, private bssService: BssService) {}

  gridStyle = {
    width: '25%',
    textAlign: 'center',
    border: false
  };

  // TODO: 当存在多个region时，this.resourceAll被重复赋值
  getRegions() {
    this.isSpinning = true;
    this.bssService.getProductDetail(this.userId, 'TSDB', 'TSDB_std').subscribe(response2 => {
      const regions = response2.result.productLineList[0].productTypeList[0].regionList;
      for (let i = 0; i < regions.length; i++) {
        this.tsdbService.getOutlineInfo(regions[i].code).subscribe( (response: any) => {
            if (this.resourcesByRegions.length === 0) {
              if (response.result !== undefined) {
                const resouce = new Resource;
                resouce.regionName = regions[i].name;
                resouce.total = response.result.totalNum;
                resouce.running = response.result.runNum;
                resouce.recentPurchase = response.result.recentNum;
                resouce.expired = response.result.expired;
                resouce.toBeExpired = response.result.willExpired;
                this.resourcesByRegions.push(resouce);
              } else {
                this.resourcesByRegions.push
                  ({
                    regionName : regions[i].name,
                    total : '0',
                    running : '0',
                    recentPurchase : '0',
                    expired: '0',
                    toBeExpired: '0'
                  })
                ;
              }
            }
            this.resourcesAll.regionName = 'all';
            this.resourcesAll.total = 0;
            this.resourcesAll.running = 0;
            this.resourcesAll.recentPurchase = 0;
            this.resourcesAll.toBeExpired = 0;
            this.resourcesAll.expired = 0;
            for (let i2 = 0; i2 < this.resourcesByRegions.length; i2++) {
              this.resourcesAll.total += Number(this.resourcesByRegions[i2].total);
              this.resourcesAll.running += Number(this.resourcesByRegions[i2].running);
              this.resourcesAll.recentPurchase += Number(this.resourcesByRegions[i2].recentPurchase);
              this.resourcesAll.expired += Number(this.resourcesByRegions[i2].expired);
              this.resourcesAll.toBeExpired += Number(this.resourcesByRegions[i2].toBeExpired);
            }
            this.isSpinning = false;

            // 控制台信息
            console.log('获取概览信息！' + response.statusText + response.status);
        });
      }
    });
  }

  ngOnInit() {
    this.getRegions();
  }

  navToPurchasePage() {
    // window.open('/#/tsdb?region=/' + NavHeaderService.region + '/add', '_blank');
    window.open('/tsdb/#/tsdb/add', '_blank');
  }

  navToDocumentPage() {
    window.open('/document/tsdb/index.html', '_blank');
  }

}

