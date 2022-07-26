import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';

@Component({
  selector: 'app-sub-module-information',
  template: ` <ion-content>
    <div>
      <app-sub-module-info *ngIf="this.subModule" [subModule]="this.subModule"></app-sub-module-info>
    </div>
    <div class="ion-padding">
      <div>
        <ion-button
          appTrackClick
          class="ux_button"
          expand="block"
          color="secondary"
          name="ux_education_learn"
          (click)="this.goToLearningMore()"
          >{{ 'financial_education.shared.sub_module_info.button_1' | translate }}</ion-button
        >
      </div>
      <div>
        <ion-button
          appTrackClick
          class="ux_button ux-button-outlined"
          expand="block"
          name="ux_education_test"
          (click)="this.goToStartTest()"
          >{{ 'financial_education.shared.sub_module_info.button_2' | translate }}</ion-button
        >
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./sub-module-information.page.scss'],
})
export class SubModuleInformationPage implements OnInit {
  selectedCategory: string;
  module: any;
  subModule: any;
  data: any;
  wallet : any;
  wallet_address : string;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private storageService: StorageService,
    private financialEducationService: FinancialEducationService,
  ) {}

  async ionViewWillEnter(){
    this.getParams();
    await this.getUserWalletAddress();

  }
  
  ngOnInit() {
  }

  getParams() {
    this.selectedCategory = this.route.snapshot.paramMap.get('category');
    this.module = parseInt(this.route.snapshot.paramMap.get('module'));
    this.subModule = parseInt(this.route.snapshot.paramMap.get('submodule'));
  }

  private async getUserWalletAddress() {
     this.wallet = await this.storageService.getWalletFromStorage();
     if(this.wallet){
      this.wallet_address = this.wallet.addresses.ERC20;
      this.getEducationDataOf(this.wallet_address);
     }
   }

  getEducationDataOf(anAddress: string) {
    this.financialEducationService.getEducationDataOf(anAddress).subscribe((data) => {
      this.data = data;
      this.setDataByTab();
    });
  }


  setDataByTab() {
    const category = this.selectedCategory === 'finance' ? this.data.finance : this.data.crypto;
    this.getModule(category);
  }

  getModule(ofCategory) {
    this.module = ofCategory.find((module) => module.id === this.module);
    this.getSubModule(this.module);
  }

  getSubModule(ofModule) {
    for (const subModule of ofModule.submodules) {
      if (subModule.id === this.subModule) this.subModule = subModule;
    }
  }


  goToLearningMore() {
    if (!this.wallet) {
      this.navController.navigateForward(['financial-education/error-no-wallet']);
    } else {
      this.navController.navigateForward([
        'financial-education/typeform/category',
        this.selectedCategory,
        'module',
        this.module.id,
        'submodule',
        this.subModule.id,
        'code',
        this.subModule.learning_code,
      ]);
    }
  }

  goToStartTest() {
    if (!this.wallet) {
      this.navController.navigateForward(['financial-education/error-no-wallet']);
    } else {
      this.navController.navigateForward([
        'financial-education/typeform/category',
        this.selectedCategory,
        'module',
        this.module.id,
        'submodule',
        this.subModule.id,
        'code',
        this.subModule.test_code,
      ]);
    }
  }
}
