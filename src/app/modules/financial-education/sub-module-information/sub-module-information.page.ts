import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MODULES_CRYPTO } from '../shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';

@Component({
  selector: 'app-sub-module-information',
  template: ` <ion-content>
    <app-sub-module-info [subModule]="this.subModule"></app-sub-module-info>
  </ion-content>`,
  styleUrls: ['./sub-module-information.page.scss'],
})
export class SubModuleInformationPage implements OnInit {
  selectedTab;
  module;
  subModule;
  data;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.selectedTab = this.route.snapshot.queryParamMap.get('tab');
    this.module = this.route.snapshot.queryParamMap.get('module');
    this.subModule = this.route.snapshot.queryParamMap.get('sub_module');
    this.getData();
    this.getModule();
    this.getSubModule();
  }

  getData() {
    this.data = this.selectedTab === 'finance' ? MODULES_FINANCE : MODULES_CRYPTO;
  }

  getModule() {
    this.module = this.data.find((module) => module.name === this.module);
  }

  getSubModule() {
    for (let subModule of this.module.sub_modules) {
      if (subModule.name === this.subModule) this.subModule = subModule;
    }
  }
}
