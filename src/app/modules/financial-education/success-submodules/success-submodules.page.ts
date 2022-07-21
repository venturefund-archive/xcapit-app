import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { ModulesService } from 'src/app/modules/financial-education/shared-financial-education/services/modules/modules.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { DATA } from '../shared-financial-education/constants/data';

@Component({
  selector: 'app-success-submodules',
  template: ` <ion-header>
      <ion-toolbar color="transparent" class="ux_toolbar no-border">
        <ion-buttons class="back-button " slot="end">
          <app-share-education [lightBackground]="true"> </app-share-education>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-success-content *ngIf="this.succes_data" [data]="this.succes_data"> </app-success-content>
    </ion-content>`,
  styleUrls: ['./success-submodules.page.scss'],
})
export class SuccessSubmodulesPage implements OnInit {
  succes_data: any;
  modules;
  subModule;
  data :any;
  constructor(
    private trackService: TrackService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.succes_data = SUCCESS_TYPES.success_submodules;
    this.setModules();
    this.setTitle();
    this.event();
  }

  setModules() {
    this.data = DATA;
  }

  setTitle() {
     const category = (this.route.snapshot.paramMap.get('category'));
     const moduleId = parseInt(this.route.snapshot.paramMap.get('module'));
     const submoduleId = parseInt(this.route.snapshot.paramMap.get('submodule'));

    this.data = category === 'finance' ? this.data.finance : this.data.crypto;
    
   

    const module = this.data.find((item) => item.id === moduleId);
    this.subModule = module.submodules && module.submodules.find((submodule) => submodule.id === submoduleId);
    console.log(module, submoduleId , this.subModule)
    this.data.textPrimary = this.translate.instant('financial_education.success_submodule.textPrimary', {
      submodule: this.translate.instant(this.subModule.title),
     });
  }

  event() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: this.subModule.screenViewLabel,
    });
  }
}
