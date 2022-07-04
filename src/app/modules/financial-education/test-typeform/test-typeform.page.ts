import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { createWidget } from '@typeform/embed';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { MODULES_CRYPTO } from '../shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';

@Component({
  selector: 'app-test-typeform',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" defaultHref="tabs/financial-education"></ion-back-button>
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
  wallet_address:string;
  subModule: any;
  data: any;
  code: string;
  headerText: string;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.getUserWalletAddress();
    this.getParams();
    this.getData();
    this.getModule();
    this.getSubModule();
    this.createTypeform();
    this.updateTexts();
  }


  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.wallet_address = wallet.addresses.ERC20;
  }


  createTypeform() {
    createWidget(this.code, {
      container: document.querySelector('#form'),
      hidden:{
        wallet_address:`${this.wallet_address}`,
        submodule_id:`${this.subModule.id}`,
      },
      onSubmit: () => {
        this.redirectToPage();
      },
    });
  }

  getParams() {
    this.selectedTab = this.route.snapshot.paramMap.get('tab');
    this.module = this.route.snapshot.paramMap.get('module');
    this.subModule = this.route.snapshot.paramMap.get('submodule');
    this.code = this.route.snapshot.paramMap.get('code');
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
    this.navController.navigateForward([
      'tabs/financial-education/information/tab',
      this.selectedTab,
      'module',
      this.module.name,
      'submodule',
      this.subModule.name,
    ]);
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
