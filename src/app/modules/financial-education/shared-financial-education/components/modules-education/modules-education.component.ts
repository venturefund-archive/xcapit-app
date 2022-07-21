import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FinancialEducationService } from '../../services/financial-education/financial-education.service';

@Component({
  selector: 'app-modules-education',
  template: `
    <ion-accordion-group [value]="this.module.open" (ionChange)="this.change()">
      <ion-accordion [value]="true" [disabled]="this.module.coming_soon" class="accordion-arrow-info">
        <ion-item class="ux-font-titulo-xs" slot="header" name="item_module">
          <img class="icon" name="module_img" [src]="this.module.icon" />
          <div>
            <div>
              <ion-label name="module_title">{{ this.module.title | translate }}</ion-label>
            </div>
            <!-- estado del modulo -->
            <div class="ux-font-text-xxs" *ngIf="!this.module.coming_soon">
              <ion-label name="module_title">
                {{ 'financial_education.home.statuses.' + this.module.status | translate }}</ion-label
              >
            </div>
            <!-- hasta aca -->
            <div class="ux-font-text-xxs" *ngIf="this.module.coming_soon">
              <ion-label name="module_coming_soon">{{ 'financial_education.home.coming_soon' | translate }}</ion-label>
            </div>
          </div>
        </ion-item>
        <ion-list slot="content">
          <ion-item
            class="ux-font-text-xxs"
            name="item_sub_module"
            appTrackClick
            [dataToTrack]="{ eventLabel: submodule.data_to_track }"
            *ngFor="let submodule of this.module.submodules; let i = index"
            (click)="this.goToPage(submodule)"
          >
            <div class="item-content">
              <div class="item-content__body">
                <ion-icon name="ux-forward"></ion-icon>
                <div>
                  <ion-label name="sub_module_title ux-font-text-xxs" color="primary">{{
                    submodule.title | translate
                  }}</ion-label>
                  <!-- estado del modulo -->
                  <div class="ux-font-text-xxs">
                    <ion-label name="module_state">{{
                      'financial_education.home.statuses.' + this.submodule.status | translate
                    }}</ion-label>
                  </div>
                </div>
                <ion-icon class="item-content__body__arrow" name="ux-forward"></ion-icon>
              </div>
              <!-- hasta aca -->
              <div class="item-content__divider">
                <div class="list-divider light" *ngIf="this.module.submodules.length != i + 1"></div>
              </div>
            </div>
          </ion-item>
        </ion-list>
      </ion-accordion>
      <div class="list-divider" *ngIf="!this.module.last"></div>
    </ion-accordion-group>
  `,
  styleUrls: ['./modules-education.component.scss'],
})
export class ModulesEducationComponent implements OnInit {
  @Input() module: any;
  @Input() selectedTab: string;
  open = true;
  wallet_address: string;
  // data = DATA;
  constructor(
    private navController: NavController,
    private financialEducationService: FinancialEducationService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.getUserWalletAddress();
  }

  goToPage(subModule) {
    this.navController.navigateForward([
      'tabs/financial-education/information/tab',
      this.selectedTab,
      'module',
      this.module.name,
      'submodule',
      subModule.name,
    ]);
  }

  change() {
    if (this.open) {
      this.open = !this.module.open;
      Object.assign(this.module, { open: this.open });
    }
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.wallet_address = wallet.addresses.ERC20;
    // this.getEducationDataOf(this.wallet_address);
  }

  // getEducationDataOf(anAddress: string) {
  //   this.financialEducationService.getEducationDataOf(anAddress).subscribe((res) => {
  //     this.data = res;
  //     console.log(this.data);
  //   });
  // }
}
