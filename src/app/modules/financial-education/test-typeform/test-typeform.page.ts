import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { createWidget } from '@typeform/embed';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { DATA } from '../shared-financial-education/constants/data';
import { SUBMODULE } from '../shared-financial-education/constants/submodule';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
@Component({
  selector: 'app-test-typeform',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" (click)="this.goBack()"></ion-back-button>
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
  wallet_address: string;
  subModule: any;
  data: any;
  code: string;
  headerText: string;
  submoduleResult: any;
  categoriesCompleted: boolean;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private translate: TranslateService,
    private storageService: StorageService,
    private financialEducationService: FinancialEducationService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.getUserWalletAddress();
    this.getEducationDataOf(this.wallet_address);
    this.getParams();
    this.getData();
    this.getModule();
    this.getSubModule();
    this.createTypeform();
    this.updateTexts();
  }

  areCategoriesCompleted() {
    for (let categorie of this.data) {
      for (let module of categorie) {
        if (!module.coming_soon && module.status === 'completed') {
          this.categoriesCompleted = true;
        }
      }
    }
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.wallet_address = wallet.addresses.ERC20;
  }

  getEducationDataOf(anAddress: string) {
    this.financialEducationService.getEducationDataOf(anAddress).subscribe((res) => {
      this.data = DATA;
    });
    this.areCategoriesCompleted();
  }

  createTypeform() {
    createWidget(this.code, {
      container: document.querySelector('#form'),
      hidden: {
        wallet_address: `${this.wallet_address}`,
        submodule_id: `${this.subModule.id}`,
      },
      onSubmit: () => {
        this.getEducationDataOf(this.wallet_address);
        this.getSubmoduleResult();
        this.redirect();
      },
    });
  }

  getParams() {
    this.selectedTab = this.route.snapshot.paramMap.get('tab');
    this.module = parseInt(this.route.snapshot.paramMap.get('module'));
    this.subModule = parseInt(this.route.snapshot.paramMap.get('submodule'));
    this.code = this.route.snapshot.paramMap.get('code');
  }

  getData() {
    this.data = this.selectedTab === 'finance' ? this.data.finance : this.data.crypto;
  }

  getModule() {
    this.module = this.data.find((module) => module.id === this.module);
  }

  getSubModule() {
    for (const subModule of this.module.submodules) {
      if (subModule.id === this.subModule) this.subModule = subModule;
    }
  }

  getSubmoduleResult() {
    this.financialEducationService.getSubmoduleResultOf(this.subModule.id, this.wallet_address).subscribe((res) => {
      this.submoduleResult = SUBMODULE;
    });
  }

  redirect() {
    let url = '';
    if (!this.categoriesCompleted) {
      url =
        this.submoduleResult.status === 'completed'
          ? 'financial-education/success-submodules'
          : 'financial-education/error-test';
    } else {
      url = 'financial-education/final-success-test';
    }

    this.navController.navigateForward(url);
  }

  private updateTexts() {
    const moduleName = this.translate.instant(`financial_education.typeform_header.finance_sub_${this.subModule.id}`);
    if (this.code === this.subModule.learning_code) {
      this.headerText = moduleName;
    } else {
      const generalText = this.translate.instant('financial_education.typeform_header.text');
      this.headerText = generalText + ' ' + moduleName;
    }
  }

  goBack() {
    this.navController.navigateForward([
      '/tabs/financial-education/information/tab/',
      this.selectedTab,
      'module',
      this.module.id,
      'submodule',
      this.subModule.id,
    ]);
  }
}
