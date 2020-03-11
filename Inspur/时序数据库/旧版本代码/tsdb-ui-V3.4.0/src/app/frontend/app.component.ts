import { Component, OnInit } from '@angular/core';
import {Environment} from '../../environments/environment';
import { WebsocketService } from '@global/shared';
import { RouteguardService } from '@global/shared/routeGuard.service';
import { NavHeaderService } from '@global/layout/default/nav-header/nav-header.service';
import { en_US, zh_CN, NzI18nService} from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLanguageService } from '@global/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private websocketService: WebsocketService, private nzI18nService: NzI18nService,
    private LanguageService: ChangeLanguageService, private ngxTranslate: TranslateService) {
  }

  language = '';

  switchLanguage(lang) {
    if (lang === 'en') {
      this.nzI18nService.setLocale(en_US);
    } else {
      this.nzI18nService.setLocale(zh_CN);
    }
  }

  ngOnInit() {
    this.websocketService.connect(Environment.application.websocketServer);
    NavHeaderService.environment = Environment.application;
    RouteguardService.environment = Environment.application;

    this.language = this.LanguageService.getBrowserLang();
    this.ngxTranslate.use(this.language);
    this.switchLanguage(this.language);
    this.LanguageService.getSelectedLang().subscribe(data => {
      if (!data.lang) {
        this.language = 'zh';
      } else {
        this.language = data.lang;
      }
      this.ngxTranslate.use(this.language);
      this.switchLanguage(this.language);
    });
  }
}
