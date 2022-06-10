import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { createWidget } from '@typeform/embed';
import { MODULES_CRYPTO } from '../shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';

@Component({
  selector: 'app-test-typeform',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" defaultHref="/financial-education/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.headerText }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="content">
      <div style="height:100%; width:100%;" id="form"></div>
    </ion-content>
  `,
  styleUrls: ['./test-typeform.page.scss'],
})
export class TestTypeformPage implements OnInit {
  selectedTab: string;
  module: any;
  subModule: any;
  data: any;
  code: string;
  headerText: string;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getParams();
    this.createTypeform();
    this.getData();
    this.getModule();
    this.getSubModule();
    this.updateTexts();
  }

  createTypeform() {
    createWidget(this.code, {
      container: document.querySelector('#form'),
      onSubmit: () => {
        this.redirectToPage();
      },
    });
  }

  getParams() {
    this.selectedTab = this.route.snapshot.queryParamMap.get('tab');
    this.module = this.route.snapshot.queryParamMap.get('module');
    this.subModule = this.route.snapshot.queryParamMap.get('sub_module');
    this.code = this.route.snapshot.queryParamMap.get('code');
  }

  getData() {
    this.data = this.selectedTab === 'finance' ? MODULES_FINANCE : MODULES_CRYPTO;
  }

  getModule() {
    this.module = this.data.find((module) => module.name === this.module);
  }

  getSubModule() {
    for (const subModule of this.module.sub_modules) {
      if (subModule.name === this.subModule) this.subModule = subModule;
    }
  }

  redirectToPage() {
    this.updateTexts();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        tab: this.selectedTab,
        module: this.module.name,
        sub_module: this.subModule.name,
      },
    };
    this.navController.navigateForward(['financial-education/information'], navigationExtras);
  }

  private updateTexts() {
    const moduleName = this.translate.instant(`financial_education.typeform_header.${this.subModule.name}`);
    if (this.code === this.subModule.learning_code) {
      this.headerText = moduleName;
    } else {
      const generalText = this.translate.instant('financial_education.typeform_header.text');
      this.headerText = generalText + ' ' + moduleName;
    }
  }
}
