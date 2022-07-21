import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/users/shared-users/services/auth/auth.service';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { ITEM_MENU } from '../shared-profiles/constants/item-menu';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { MenuCategory } from '../shared-profiles/interfaces/menu-category.interface';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { LogOutModalService } from '../shared-profiles/services/log-out-modal/log-out-modal.service';
import { LogOutModalComponent } from '../shared-profiles/components/log-out-modal/log-out-modal.component';

@Component({
  selector: 'app-user-profile-menu',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="this.back()"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.user_profile_menu.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="user-profile-card" *ngIf="this.profile">
        <app-user-profile-card [profile]="this.profile"></app-user-profile-card>
      </div>
      <div class="referrals-promotion">
        <app-referral-promotion-card></app-referral-promotion-card>
      </div>
      <div class="card-item" *ngIf="this.itemMenu">
        <app-card-category-menu *ngFor="let category of this.itemMenu" [category]="category"></app-card-category-menu>
      </div>
      <div>
        <div class="ux-card">
          <div class="card-title">
            <img class="card-title__img" src="assets/ux-icons/ux-apikeys.svg" />
            <ion-text class="ux-font-header-titulo card-title__text">{{
              'profiles.user_profile_menu.category_preferences' | translate
            }}</ion-text>
          </div>
          <div>
            <ion-button
              [disabled]="this.disable"
              class="ux-font-text-xs"
              name="Change Language"
              fill="clear"
              appTrackClick
              (click)="this.changeLanguage()"
            >
              <ion-text color="neutral90">{{ 'profiles.user_profile_menu.language' | translate }}</ion-text></ion-button
            >
          </div>
        </div>
      </div>
      <ion-button
        class="menu-item ux-font-text-xs"
        name="Log Out"
        color="primary"
        fill="clear"
        appTrackClick
        (click)="this.logout()"
        >{{ 'app.main_menu.logout' | translate }}
        <ion-icon color="primary" slot="start" name="ux-logout-icon"></ion-icon>
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./user-profile-menu.page.scss'],
})
export class UserProfileMenuPage {
  profile: any;
  disable = false;
  itemMenu: MenuCategory[] = ITEM_MENU;

  constructor(
    private apiProfiles: ApiProfilesService,
    private authService: AuthService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService,
    private language: LanguageService,
    private walletService: WalletService,
    private logOutModalService: LogOutModalService
  ) {}

  ionViewWillEnter() {
    this.getProfile();
    this.existWallet();
  }

  back() {
    this.navController.navigateForward('/tabs/home');
  }

  private getProfile() {
    this.apiProfiles.getUserData().subscribe((res) => {
      this.profile = res;
    });
  }

  async logout() {
    if ((await this.walletService.walletExist()) && (await this.logOutModalService.isShowModalTo(this.profile.email))) {
      await this.showLogOutModal();
    } else {
      await this.authService.logout();
      await this.navController.navigateRoot('users/login');
    }
  }

  async showLogOutModal() {
    const modal = await this.modalController.create({
      component: LogOutModalComponent,
      componentProps: {
        username: this.profile.email,
      },
      cssClass: 'log-out-modal',
    });

    await modal.present();
  }

  async changeLanguage() {
    this.disable = true;
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant('app.main_menu.change_language'),
        data: this.language.getLanguages(),
        keyName: 'text',
        valueName: 'value',
        selected: await this.language.getSelectedLanguage(),
      },
      cssClass: 'ux_modal_crm',
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.role === 'selected') {
      this.language.setLanguage(data.data);
    }
    this.disable = false;
  }

  existWallet() {
    this.walletService.walletExist().then((res) => {
      const item = this.itemMenu.find((item) => item.id === 'wallet');
      item.showCategory = res;
    });
  }
}