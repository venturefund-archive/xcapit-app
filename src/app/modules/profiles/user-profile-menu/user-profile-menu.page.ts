import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/users/shared-users/services/auth/auth.service';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { LogOutModalService } from '../shared-profiles/services/log-out-modal/log-out-modal.service';
import { LogOutModalComponent } from '../shared-profiles/components/log-out-modal/log-out-modal.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { LoggedIn } from '../../users/shared-users/models/logged-in/logged-in';
import { RemoteConfigService } from '../../../shared/services/remote-config/remote-config.service';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Subject } from 'rxjs';
import { UpdateAppService } from 'src/app/shared/services/update-app/update-app.service';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { LastVersion } from 'src/app/shared/models/last-version/last-version';
import { Menu } from '../shared-profiles/models/menu/menu';
import { RawMenuCategory } from '../shared-profiles/models/raw-menu-category';

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
      <div class="card-item" *ngIf="this.rawMenu">
        <app-card-category-menu *ngFor="let category of this.rawMenu" [category]="category"></app-card-category-menu>
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
            <ng-container *ngIf="!this.inReview">
              <ion-item lines="none" class="ion-no-padding" *appFeatureFlag="'ff_warranty_wallet'">
                <ion-text class="notifications_text ux-font-text-xs">
                  {{ 'profiles.user_profile_menu.wallet_type' | translate }}</ion-text
                >
                <ion-toggle
                  formControlName="web3Activated"
                  name="ux_wallet_type"
                  class="ux-toggle ion-no-padding"
                  mode="ios"
                  slot="end"
                ></ion-toggle>
              </ion-item>
            </ng-container>
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
              <ion-text>{{ 'profiles.user_profile_menu.language' | translate }}</ion-text>
            </ion-button>
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
  rawMenu: RawMenuCategory[];
  form: UntypedFormGroup = this.formBuilder.group({
    notifications: [[]],
    web3Activated: [[]],
  });

  leave$ = new Subject<void>();
  appUpdate = AppUpdate;
  actualVersion: string;
  showButton: boolean;
  isNative: boolean;
  inReview = true;
  private readonly _aTopic = 'app';
  private readonly _aKey = '_enabledPushNotifications';
  private _menu: Menu;

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
    private remoteConfig: RemoteConfigService,
    private formBuilder: FormBuilder,
    private trackService: TrackService,
    private appVersionService: AppVersionInjectable,
    private updateAppService: UpdateAppService,
    private platform: DefaultPlatformService
  ) {}

  async ionViewWillEnter() {
    await this._setInReviewApp();
    this.getProfile();
    this._menu = new Menu();
    await this._toggleSeedPhrase();
    await this.walletService.walletExist();
    await this.setUsername();
    this._contactsListAvailable();
    this._setRawMenu();
    await this.setPushNotifications();
    this.valueChanges();
    this._setWarrantyWalletState();
    this._walletConnectStatus();
    this.isNative = this.platform.isNative();
    if (this.isNative) {
      this.getActualVersion();
      this.checkUpdate();
    }
  }

  private async _toggleSeedPhrase() {
    this._menu = (await this._isWarrantyWallet())
      ? this._menu.hide('Wallet', 'RecoveryPhrase')
      : this._menu.show('Wallet', 'RecoveryPhrase');
    this._setRawMenu();
  }

  private async _setInReviewApp(): Promise<void> {
    this.inReview = await new LastVersion(this.appVersionService.create(), this.remoteConfig, this.platform).inReview();
  }

  async setPushNotifications() {
    this.form.patchValue({ notifications: await this._pushNotificationsEnabled() });
  }

  async _pushNotificationsEnabled() {
    return await this.ionicStorageService.get(this._aKey).then((res) => res);
  }

  private async _isWarrantyWallet() {
    return await new SimplifiedWallet(this.ionicStorageService).value();
  }

  private async _setWarrantyWalletState() {
    this.form.patchValue({ web3Activated: !(await this._isWarrantyWallet()) });
  }

  private valueChanges() {
    this.form.get('notifications').valueChanges.subscribe((value) => {
      this.togglePushNotifications(value);
      this.setEventNotifications(value);
    });
    this.form.get('web3Activated').valueChanges.subscribe(async (web3Activated) => {
      this.setEventWeb3(web3Activated);
      await new SimplifiedWallet(this.ionicStorageService).save(!web3Activated);
      this._menu = web3Activated
        ? this._menu.show('WalletConnect').show('Contacts')
        : this._menu.hide('WalletConnect').hide('Contacts');

      this._setRawMenu();
      await this._toggleSeedPhrase();
    });
  }

  private _setRawMenu() {
    this.rawMenu = this._menu.json();
  }

  setEventNotifications(value: boolean) {
    this.trackService.trackEvent({
      eventLabel: `ux_push_notifications_${value ? 'on' : 'off'}`,
    });
  }

  setEventWeb3(value: boolean) {
    const eventLabel = value ? 'on' : 'off';
    this.trackService.trackEvent({
      eventLabel: `ux_toggle_web3_${eventLabel}`,
    });
  }

  private _pushNotificationsService() {
    return this.notificationsService.getInstance();
  }

  async togglePushNotifications(value: boolean) {
    await this.ionicStorageService.set(this._aKey, value);
    value
      ? this._pushNotificationsService().subscribeTo(this._aTopic)
      : this._pushNotificationsService().unsubscribeFrom(this._aTopic);
    await this._pushNotificationsService().toggleUserNotifications(value).toPromise();
  }

  private _walletConnectStatus(): void {
    this._menu = this._menu.withWalletConnectStatus(this.walletConnectService.connected);
    this._setRawMenu();
  }

  private _contactsListAvailable(): void {
    this._menu = this.remoteConfig.getFeatureFlag('ff_address_list')
      ? this._menu.show('Contacts')
      : this._menu.hide('Contacts');
    this._setRawMenu();
  }

  back() {
    this.navController.navigateForward('tabs/wallets');
  }

  private getProfile() {
    this.apiProfiles.getUserData().subscribe((res) => {
      this.profile = res;
    });
  }

  async handleLogout() {
    (await this.showModal()) ? this.showLogOutModal() : this.logout();
  }

  private profileExists() {
    return !!this.profile;
  }

  private async showModal() {
    return this.profileExists() && (await this.logOutModalService.isShowModalTo(this.profile.email));
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

  async setUsername() {
    this.username = `Xcapiter ${this.walletService.addresses['ERC20'].substring(0, 5)}`;
  }

  goToDeleteAccount() {
    this.navController.navigateForward('profiles/delete-account');
  }

  async getActualVersion() {
    this.actualVersion = await this.appVersionService.create().current();
  }

  async checkUpdate() {
    this.showButton =
      (await this.appUpdate.getAppUpdateInfo()).updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE;
  }

  updateApp() {
    this.updateAppService.update();
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
