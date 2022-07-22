import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

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
      <app-success-content *ngIf="this.success_data" [data]="this.success_data"> </app-success-content>
    </ion-content>`,
  styleUrls: ['./success-submodules.page.scss'],
})
export class SuccessSubmodulesPage implements OnInit {
  success_data: any;
  modules;
  subModule;
  data :any;
  constructor(
    private trackService: TrackService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private financialEducationService : FinancialEducationService,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.success_data = SUCCESS_TYPES.success_submodules;
    await this.getUserWalletAddress();
    this.setTitle();
    this.event();
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    const wallet_address = wallet.addresses.ERC20;
    this.getEducationDataOf(wallet_address);
  }

  getEducationDataOf(anAddress: string) {
    // this.data = DATA;
    this.financialEducationService.getEducationDataOf(anAddress).subscribe((data) => {
      this.data = data;
    });
  }


  setTitle() {
     const category = (this.route.snapshot.paramMap.get('category'));
     const moduleId = parseInt(this.route.snapshot.paramMap.get('module'));
     const submoduleId = parseInt(this.route.snapshot.paramMap.get('submodule'));

    this.data = category === 'finance' ? this.data.finance : this.data.crypto;
    
  
    const module = this.data.find((item) => item.id === moduleId);
    this.subModule = module.submodules && module.submodules.find((submodule) => submodule.id === submoduleId);
    this.success_data.textPrimary = this.translate.instant('financial_education.success_submodule.textPrimary', {
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
