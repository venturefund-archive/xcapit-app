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
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { LoggedIn } from '../../users/shared-users/models/logged-in/logged-in';
import { BiometricAuthInjectable } from '../../../shared/models/biometric-auth/injectable/biometric-auth.injectable';
import { RemoteConfigService } from '../../../shared/services/remote-config/remote-config.service';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UpdateAppService } from 'src/app/shared/services/update-app/update-app.service';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';

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
      <div class="user-profile-card" *ngIf="this.profile && this.username">
        <app-user-profile-card [profile]="this.profile" [username]="this.username"></app-user-profile-card>
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
            <img class="card-title__img" src="assets/ux-icons/ux-preferences-primary.svg" />
            <ion-text class="ux-font-header-titulo card-title__text">{{
              'profiles.user_profile_menu.category_preferences' | translate
            }}</ion-text>
          </div>
          <form class="notifications_form" [formGroup]="this.form">
            <ion-item lines="none" class="ion-no-padding">
              <ion-text class="notifications_text ux-font-text-xs">
                {{ 'profiles.user_profile_menu.push_notifications' | translate }}</ion-text
              >
              <ion-toggle
                formControlName="notifications"
                name="ux_push_notifications"
                class="ux-toggle ion-no-padding"
                mode="ios"
                slot="end"
              ></ion-toggle>
            </ion-item>
            <ion-item lines="none" class="ion-no-padding">
              <ion-text class="notifications_text ux-font-text-xs">
                {{ 'profiles.user_profile_menu.wallet_type' | translate }}</ion-text
              >
              <ion-toggle
                formControlName="warrantyWallet"
                name="ux_wallet_type"
                class="ux-toggle ion-no-padding"
                mode="ios"
                slot="end"
              ></ion-toggle>
            </ion-item>
          </form>
          <div class="language">
            <ion-button
              [disabled]="this.disable"
              class="ux-font-text-xs"
              name="Change Language"
              fill="clear"
              appTrackClick
              (click)="this.changeLanguage()"
            >
              <ion-text>{{ 'profiles.user_profile_menu.language' | translate }}</ion-text></ion-button
            >
          </div>
        </div>
      </div>
      <ion-button
        class="ux-font-text-xs"
        name="Log Out"
        color="primary"
        fill="clear"
        appTrackClick
        (click)="this.handleLogout()"
        >{{ 'app.main_menu.logout' | translate }}
        <ion-icon color="primary" slot="start" name="ux-logout-icon"></ion-icon>
      </ion-button>
      <div class="remove-account">
        <ion-button
          [disabled]="this.disable"
          class="ux-font-text-xs"
          name="delete_account"
          color="dangerdark"
          fill="clear"
          appTrackClick
          (click)="this.goToDeleteAccount()"
          >{{ 'profiles.user_profile_menu.delete_account_button' | translate }}
          <ion-icon color="dangerdark" slot="start" name="ux-trash"></ion-icon>
        </ion-button>
      </div>
      <div class="version" *ngIf="this.isNative">
        <div class=" version__content">
          <img class="version__content__img" src="assets/img/logo-xcapit-grey.svg" />
          <ion-text class="version__content__text ux-font-text-xs" color="neutral50"
            >{{ 'profiles.user_profile_menu.version' | translate }} {{ this.actualVersion }}</ion-text
          >
        </div>
        <div class="version__update" *ngIf="this.showButton">
          <ion-text name="Update" class="version__update__text ux-link-xs" (click)="updateApp()">{{
            'profiles.user_profile_menu.update' | translate
          }}</ion-text>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./user-profile-menu.page.scss'],
})
export class UserProfileMenuPage {
  profile: any;
  disable = false;
  username: string;
  itemMenu: MenuCategory[] = ITEM_MENU;
  form: UntypedFormGroup = this.formBuilder.group({
    notifications: [[]],
    warrantyWallet: [[]],
  });
  private readonly _aTopic = 'app';
  private readonly _aKey = 'enabledPushNotifications';
  leave$ = new Subject<void>();
  appUpdate = AppUpdate;
  actualVersion: string;
  showButton: boolean;
  isNative: boolean;

  constructor(
    private apiProfiles: ApiProfilesService,
    private authService: AuthService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService,
    private language: LanguageService,
    private walletService: WalletService,
    private logOutModalService: LogOutModalService,
    private ionicStorageService: IonicStorageService,
    private walletConnectService: WalletConnectService,
    private notificationsService: NotificationsService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private remoteConfig: RemoteConfigService,
    private formBuilder: FormBuilder,
    private trackService: TrackService,
    private appVersionService: AppVersionInjectable,
    private updateAppService: UpdateAppService,
    private platform: PlatformService
  ) {}

  async ionViewWillEnter() {
    this.getProfile();
    this.existWallet();
    this.contactsListAvailable();
    this.biometricAuthAvailable();
    await this.setPushNotifications();
    this.valueChanges();
    this.setWarrantyWalletState();
    this.walletConnectStatus();
    this.isNative = this.platform.isNative();
    if (this.isNative) {
      this.getActualVersion();
      this.checkUpdate();
    }
  }

  async setPushNotifications() {
    this.form.patchValue({ notifications: await this.enabled() });
  }

  async enabled() {
    return await this.ionicStorageService.get(this._aKey).then((res) => res);
  }

  async isWarrantyWallet() {
    return await new SimplifiedWallet(this.ionicStorageService).value();
  }

  async setWarrantyWalletState() {
    this.form.patchValue({ warrantyWallet: await this.isWarrantyWallet() });
  }

  private valueChanges() {
    this.form.valueChanges.pipe(takeUntil(this.leave$)).subscribe((value) => {
      this.toggle(value.notifications);
      this.setEvent(value.notifications);
    });
    this.form.get('warrantyWallet').valueChanges.subscribe(async (value) => {
      console.log('value',value)
      await new SimplifiedWallet(this.ionicStorageService).save(value);
      this.itemMenu.forEach((category) => {
        if (!category.isWarrantyWalletOpt) {
          category.showCategory = value;
        }
      });
    });
  }

  setEvent(value: boolean) {
    const eventLabel = value ? 'on' : 'off';
    this.trackService.trackEvent({
      eventLabel: `ux_push_notifications_${eventLabel}`,
    });
  }

  pushNotificationsService() {
    return this.notificationsService.getInstance();
  }

  toggle(value: boolean) {
    this.ionicStorageService.set(this._aKey, value);
    value
      ? this.pushNotificationsService().subscribeTo(this._aTopic)
      : this.pushNotificationsService().unsubscribeFrom(this._aTopic);
  }

  async walletConnectStatus() {
    this.itemMenu.map(async (item) => {
      if (item.name === 'WalletConnect') {
        item.connected = this.walletConnectService.connected;
        item.legend = this.walletConnectService.connected
          ? 'profiles.user_profile_menu.connected_walletconnect'
          : 'profiles.user_profile_menu.disconnected_walletconnect';
      }
      return item;
    });
  }

  async biometricAuthAvailable() {
    if (await this.biometricAuthInjectable.create().available()) {
      const biometricAuthItem = this.itemMenu
        .find((category) => category.id === 'wallet')
        .items.find((item) => item.name === 'BiometricAuth');
      biometricAuthItem.hidden = !this.remoteConfig.getFeatureFlag('ff_bioauth');
    }
  }

  contactsListAvailable() {
    const contactListItem = this.itemMenu.find((category) => category.id === 'contacts');
    contactListItem.showCategory = this.remoteConfig.getFeatureFlag('ff_address_list');
  }

  async back() {
    (await this.isWarrantyWallet())
      ? this.navController.navigateForward('')
      : this.navController.navigateForward('/tabs/home');
  }

  private getProfile() {
    this.apiProfiles.getUserData().subscribe((res) => {
      this.profile = res;
    });
  }

  async handleLogout() {
    if (await this.showModal()) {
      this.showLogOutModal();
    } else {
      this.logout();
    }
  }

  private walletExist() {
    return this.walletService.walletExist();
  }

  private profileExists() {
    return !!this.profile;
  }

  private async showModal() {
    return (
      (await this.walletExist()) &&
      this.profileExists() &&
      (await this.logOutModalService.isShowModalTo(this.profile.email))
    );
  }

  async showLogOutModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: LogOutModalComponent,
      componentProps: {
        username: this.profile.email,
      },
      cssClass: 'modal',
    });

    await modal.present();
    if ((await modal.onDidDismiss()).data) {
      this.logout();
    }
  }

  async logout() {
    await new LoggedIn(this.ionicStorageService).save(false);
    await this.authService.logout();
    await this.navController.navigateRoot('users/login');
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
      cssClass: 'modal',
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
      this.setUsername();
    });
  }

  setUsername() {
    this.username = `Xcapiter ${this.walletService.addresses['ERC20'].substring(0, 5)}`;
  }

  goToDeleteAccount() {
    this.navController.navigateForward('profiles/delete-account');
  }

  async getActualVersion() {
    this.actualVersion = await this.appVersionService.create().current();
  }

  async checkUpdate() {
    const updateAvailability = (await this.appUpdate.getAppUpdateInfo()).updateAvailability;
    if (updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  updateApp() {
    this.updateAppService.update();
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
