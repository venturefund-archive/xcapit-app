import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { createWidget } from '@typeform/embed';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
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
  selectedCategory: string;
  module: any;
  wallet_address: string;
  subModule: any;
  data: any;
  code: string;
  headerText: string;
  submoduleResult: any;
  categoriesCompleted = false;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private translate: TranslateService,
    private storageService: StorageService,
    private financialEducationService: FinancialEducationService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.getParams();
    await this.getUserWalletAddress();

   
  }

  areCategoriesCompleted() {
    const allModules = [...this.data.finance, ...this.data.crypto].filter((mod) => !mod.coming_soon);
    this.categoriesCompleted = allModules.every((mod) => mod.status === 'completed');
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    if (wallet) {
      this.wallet_address = wallet.addresses.ERC20;
      this.getEducationDataOf(this.wallet_address);
    }
  }

  getEducationDataOf(anAddress: string) {
    this.financialEducationService.getEducationDataOf(anAddress).subscribe((data) => {
      this.data = data;
      this.areCategoriesCompleted();
      this.getData();
      this.getModule();
      this.getSubModule();
      this.createTypeform();
      this.updateTexts();
    });
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
    this.selectedCategory = this.route.snapshot.paramMap.get('category');
    this.module = parseInt(this.route.snapshot.paramMap.get('module'));
    this.subModule = parseInt(this.route.snapshot.paramMap.get('submodule'));
    this.code = this.route.snapshot.paramMap.get('code');
  }

  getData() {
    this.data = this.selectedCategory === 'finance' ? this.data.finance : this.data.crypto;
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
    this.financialEducationService
      .getSubmoduleResultOf(this.subModule.id, this.wallet_address)
      .subscribe((submoduleResult) => {
        this.submoduleResult = submoduleResult;
      });
    // this.submoduleResult = SUBMODULE;
  }

  redirect() {
    let url = '';
    if (this.subModule.test_code === this.code) {
      if (!this.categoriesCompleted) {
        url =
          this.submoduleResult?.status === 'completed'
            ? `financial-education/success-submodules/category/${this.selectedCategory}/module/${this.module.id}/submodule/${this.subModule.id}`
            : `financial-education/error-test/category/${this.selectedCategory}/module/${this.module.id}/submodule/${this.subModule.id}/code/${this.code}`;
      } else {
        url = 'financial-education/final-success-test';
      }
    } else {
      url = `tabs/financial-education/information/category/${this.selectedCategory}/module/${this.module.id}/submodule/${this.subModule.id}`;
    }
    this.navController.navigateForward(url);
  }

  private updateTexts() {
    const moduleName = this.translate.instant(
      `financial_education.typeform_header.${this.selectedCategory}_sub_${this.subModule?.id}`
    );
    if (this.code === this.subModule.learning_code) {
      this.headerText = moduleName;
    } else {
      const generalText = this.translate.instant('financial_education.typeform_header.text');
      this.headerText = generalText + ' ' + moduleName;
    }
  }

  goBack() {
    this.navController.navigateForward([
      '/tabs/financial-education/information/category/',
      this.selectedCategory,
      'module',
      this.module.id,
      'submodule',
      this.subModule.id,
    ]);
  }
}
