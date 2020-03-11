import { Component, OnInit } from '@angular/core';
import { TsdbService } from '../tsdb.service';

@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.css']
})
export class OutlineComponent implements OnInit {

  resourcesAll = new Resource;
  resourcesByRegions = [];

  // resourcesAll2 = {
  //   regionName: 'all',
  //   total: 5,
  //   recentPurchase: 3,
  //   running: 4
  // };
  // resourcesByRegions2 = [
  //   {
  //     regionName: 'region_1',
  //     total: 2,
  //     recentPurchase: 2,
  //     running: 1
  //   },
  //   {
  //     regionName: 'region_2',
  //     total: 2,
  //     recentPurchase: 0,
  //     running: 2
  //   },
  //   {
  //     regionName: 'region_3',
  //     total: 1,
  //     recentPurchase: 1,
  //     running: 1
  //   },
  // ];

  gridStyle = {
    width: '25%',
    textAlign: 'center',
    border: false
  };

  getOutlineInfo() {
    this.tsdbService.getOutlineInfo().subscribe( (response: any) => {
        console.log('获取概览信息！',
        // response
        );
        // this.resourcesAll = new Resource;
        this.resourcesAll.regionName = 'all';
        this.resourcesAll.total = response.result.totalNum;
        this.resourcesAll.running = response.result.runNum;
        this.resourcesAll.recentPurchase = response.result.recentNum;
        if (this.resourcesByRegions.length === 0) {
          for (const region in response.result.regions) {
            if (response.result.regions.hasOwnProperty(region)) {
              const resouce = new Resource;
              // resouce.regionName = region;
              switch (region) {
                case 'cn-north-3':
                resouce.regionName = '华北3';
                break;
              }
              resouce.total = response.result.regions[region].count;
              resouce.running = response.result.regions[region].running;
              resouce.recentPurchase = response.result.regions[region].recent;
              this.resourcesByRegions.push(resouce);
            }
          }
        }
      });
  }

  constructor(private tsdbService: TsdbService) {}

  ngOnInit() {
    this.getOutlineInfo();
  }

}

export class Resource {
  regionName: string;
  total: string;
  recentPurchase: string;
  running: string;
}
