import { Component, ElementRef, OnInit, NgZone } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LanguageService } from './shared/services/language/language.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@capacitor/status-bar';
import { PlatformService } from './shared/services/platform/platform.service';
import { CONFIG } from './config/app-constants.config';
import { URLOpenListenerEvent } from '@capacitor/app';
import { WalletConnectService } from './modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletBackupService } from './modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LocalNotificationsService } from './modules/notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { IonicStorageService } from './shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from './modules/users/shared-users/models/logged-in/logged-in';
import { TrackedWalletAddressInjectable } from './shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { AppSession } from './shared/models/app-session/app-session';
import { CapacitorAppInjectable } from './shared/models/capacitor-app/injectable/capacitor-app.injectable';
import { AppSessionInjectable } from './shared/models/app-session/injectable/app-session.injectable';
import { WalletMaintenanceService } from './modules/wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { DynamicLinkInjectable } from './shared/models/dynamic-link/injectable/dynamic-link-injectable';
import { CapacitorApp } from './shared/models/capacitor-app/capacitor-app.interface';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-split-pane contentId="main-content">
        <ion-router-outlet id="main-content"></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  onLangChange: Subscription = undefined;
  statusBar = StatusBar;
  session: AppSession;
  app: CapacitorApp;

  constructor(
    private platform: Platform,
    private submitButtonService: SubmitButtonService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef,
    private platformService: PlatformService,
    private zone: NgZone,
    private walletConnectService: WalletConnectService,
    private walletBackupService: WalletBackupService,
    private localNotificationsService: LocalNotificationsService,
    private navController: NavController,
    private storage: IonicStorageService,
    private trackedWalletAddressInjectable: TrackedWalletAddressInjectable,
    private capacitorAppInjectable: CapacitorAppInjectable,
    private appSessionInjectable: AppSessionInjectable,
    private walletMaintenanceService: WalletMaintenanceService,
    private dynamicLinkInjectable: DynamicLinkInjectable
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.statusBarConfig();
    this.submitButtonService.enabled();
    this.trackService.startTracker();
    this.setBackgroundActions();
  }

  private checkForUpdate() {
    this.updateService.checkForUpdate();
  }

  private initializeApp() {
    this.setCapacitorApp();
    this._setSession();
    this.checkAssetsStructure();
    this.checkForUpdate();
    this.walletBackupService.getBackupWarningWallet();
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.setLanguageSubscribe();
      this.checkWalletConnectAndDynamicLinks();
      this.localNotificationsService.init();
      this.trackUserWalletAddress();
    });
  }

  private setCapacitorApp() {
    this.app = this.capacitorAppInjectable.create();
  }

  private async checkAssetsStructure() {
    this.walletMaintenanceService.checkTokensStructure();
  }

  private _setSession() {
    this.session = this.appSessionInjectable.create();
  }

  private async checkWalletConnectAndDynamicLinks() {
    await this.walletConnectService.checkConnection();
    await this.walletConnectService.retrieveWalletConnect();

    if (this.platformService.isNative()) {
      this.app.onAppUrlOpen((event: URLOpenListenerEvent) => {
        this.zone.run(async () => {
          this.walletConnectDeepLinks(event);
          this.dynamicLinks(event);
        });
      });
    }
  }

  setBackgroundActions() {
    this.app.onStateChange(({ isActive }) => {
      if (isActive) {
        this.isSessionValid()
      };
    });
    this.app.onPause(() => {
      this.session.save();
    });
  }

  async isSessionValid() {
    if (!(await this.session.valid())) {
      await new LoggedIn(this.storage).save(false);
      this.redirectToNewLogin();
    }
  }

  async redirectToNewLogin() {
    return await this.navController.navigateRoot(['users/login-new']);
  }

  dynamicLinks(event) {
    this.dynamicLinkInjectable.create(event.url).redirect();
  }

  async walletConnectDeepLinks(event) {
    let url = event.url.split('?uri=').pop();

    if (url) {
      url = url.includes('wc%3A') || url.includes('wc%3a') ? decodeURIComponent(url) : url;

      if (url.includes('wc:')) {
        this.walletConnectService.setUri(url);

        if (await new LoggedIn(this.storage).value()) {
          this.walletConnectService.checkDeeplinkUrl();
        }
      }
    }
  }

  private statusBarConfig() {
    if (this.platformService.platform() === 'android') {
      this.statusBar.setBackgroundColor({ color: CONFIG.app.statusBarColor });
    }
  }

  async trackUserWalletAddress(): Promise<void> {
    const trackedWalletAddress = this.trackedWalletAddressInjectable.create();
    if (!(await trackedWalletAddress.isAlreadyTracked())) trackedWalletAddress.value();
  }

  updateLanguage(): void {
    const lang = document.createAttribute('lang');
    lang.value = this.translate.currentLang;
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
  }

  setLanguageSubscribe() {
    this.onLangChange = this.translate.onLangChange.subscribe(() => {
      this.updateLanguage();
    });
  }
}
