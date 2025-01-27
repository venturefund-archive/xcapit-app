import { Component, ElementRef, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LanguageService } from './shared/services/language/language.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@capacitor/status-bar';
import { DefaultPlatformService } from './shared/services/platform/default/default-platform.service';
import { CONFIG } from './config/app-constants.config';
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
import { LoginNewPage } from './modules/users/login-new/login-new.page';
import { TxInProgressService } from './modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { NotificationsService } from './modules/notifications/shared-notifications/services/notifications/notifications.service';
import { BrowserService } from './shared/services/browser/browser.service';
import { NetworkInjectable } from './shared/models/network/injectable/network.injectable';
import { AppExpirationTimeService } from './shared/models/app-session/injectable/app-expiration-time.service';
import { WCConnectionV2 } from './modules/wallets/shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { WCService } from './modules/wallets/shared-wallets/services/wallet-connect/wc-service/wc.service';
import { RemoteConfigService } from './shared/services/remote-config/remote-config.service';
import { DefaultWCUri } from './shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { GoogleAuthService } from './shared/services/google-auth/google-auth.service';
import { FirebaseDynamicLinks } from '@pantrist/capacitor-firebase-dynamic-links';
import { ActiveLender } from './shared/models/active-lender/active-lender';
import { DeepLinkOpen } from '@pantrist/capacitor-firebase-dynamic-links/dist/esm/definitions';
import { ActiveLenderInjectable } from './shared/models/active-lender/injectable/active-lender.injectable';
import { URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <div class="no-connection-banner" [ngStyle]="{ visibility: this.connected ? 'hidden' : 'inherit' }">
        <app-no-connection-banner></app-no-connection-banner>
      </div>
      <ion-split-pane contentId="main-content">
        <ion-router-outlet [ngStyle]="{ 'margin-top': this.connected ? 'inherit' : '26px' }" id="main-content">
        </ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isModalOpen = false;
  onLangChange: Subscription = undefined;
  statusBar = StatusBar;
  session: AppSession;
  app: CapacitorApp;
  firebaseDynamicLinks = FirebaseDynamicLinks;

  connected = false;

  constructor(
    private platform: Platform,
    private submitButtonService: SubmitButtonService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef,
    private platformService: DefaultPlatformService,
    private zone: NgZone,
    private walletConnectService: WalletConnectService,
    private walletConnectServiceV2: WCConnectionV2,
    private walletBackupService: WalletBackupService,
    private localNotificationsService: LocalNotificationsService,
    private storage: IonicStorageService,
    private trackedWalletAddressInjectable: TrackedWalletAddressInjectable,
    private capacitorAppInjectable: CapacitorAppInjectable,
    private appSessionInjectable: AppSessionInjectable,
    private walletMaintenanceService: WalletMaintenanceService,
    private dynamicLinkInjectable: DynamicLinkInjectable,
    private modalController: ModalController,
    private appExpirationTimeService: AppExpirationTimeService,
    private txInProgressService: TxInProgressService,
    private notificationsService: NotificationsService,
    private browserService: BrowserService,
    private networkInjectable: NetworkInjectable,
    private navController: NavController,
    private wcService: WCService,
    private remoteConfigService: RemoteConfigService,
    private googleAuth: GoogleAuthService,
    private activeLenderInjectable: ActiveLenderInjectable
  ) {}

  async ngOnInit() {
    this._initializeApp();
    this._statusBarConfig();
    this._enableSubmitButtonService();
    this._startTracker();
    this._setBackgroundActions();
    this._checkTransactionStatus();
    this._setConnectionStatus();
    this._initializeGoogleAuth();
    await this._setDefaultLender();
    this._subscribeToFirebaseDynamicLinks();
  }

  private _initializeGoogleAuth() {
    this.googleAuth.init();
  }

  private _enableSubmitButtonService() {
    this.submitButtonService.enabled();
  }

  private _startTracker() {
    this.trackService.startTracker();
  }

  private _checkTransactionStatus() {
    this.txInProgressService.checkTransactionStatus();
  }
  private _setConnectionStatus() {
    this.networkInjectable
      .create()
      .status()
      .subscribe((status) => {
        this.connected = status.connected;
      });
  }
  private checkForUpdate() {
    this.updateService.checkForUpdate();
  }

  private _initializeApp() {
    this.setCapacitorApp();
    this._setSession();
    this.checkAssetsStructure();
    this.checkForUpdate();
    this.walletBackupService.getBackupWarningWallet();
    this.platform.ready().then(() => {
      this._setLanguage();
      this.checkWalletConnectAndDynamicLinks();
      this.localNotificationsService.init();
      this.trackUserWalletAddress();
      this.pushNotificationActionPerformed();
    });
  }

  private async _setLanguage() {
    await this.languageService.setInitialAppLanguage();
    this.setLanguageSubscribe();
  }

  private async _setDefaultLender(): Promise<void> {
    await this._activeLender().initialSave(await this._defaultLenderName());
    return;
  }

  private async _defaultLenderName(): Promise<string> {
    return (await this._activeLender().value()).json() ? await this._activeLender().name() : 'naranjax';
  }

  private _activeLender(): ActiveLender {
    return this.activeLenderInjectable.create();
  }

  private pushNotificationActionPerformed() {
    this.notificationsService.getInstance().pushNotificationActionPerformed((notification) => {
      this.open(notification);
    });
  }

  open(_aNotification) {
    if (_aNotification.actionId === 'tap' && _aNotification.notification.data.url) {
      this._analyzeToOpen(_aNotification.notification.data.url);
    }
  }

  private async _analyzeToOpen(_aLink) {
    this.isHTTPLink(_aLink) ? await this.browseTo(_aLink) : this.navigateTo(_aLink);
  }

  private isHTTPLink(link) {
    return /^http.*/i.test(link);
  }

  private async browseTo(link) {
    await this.browserService.open({ url: link });
  }

  private async navigateTo(link) {
    await this.navController.navigateForward(link);
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
    await this.initWalletConnectV2();
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

  private async initWalletConnectV2(): Promise<void> {
    if (this.isWalletConnectV2Enabled()) await this.walletConnectServiceV2.subscribeToAllEvents();
  }

  private _setBackgroundActions() {
    this.app.onStateChange(({ isActive }) => {
      if (isActive) {
        this.isSessionValid();
      } else {
        this.session.save();
      }
    });
    this.app.onPause(() => {
      this.session.save();
    });
  }

  async isSessionValid() {
    if (!(await this.session.valid())) {
      await new LoggedIn(this.storage).save(false);
      this.showLoginModal();
    }
  }

  dynamicLinks(event) {
    this.dynamicLinkInjectable.create(event.url).redirect();
  }

  async walletConnectDeepLinks(event) {
    let url = event.url.split('?uri=').pop();
    if (url) {
      url = url.includes('wc%3A') || url.includes('wc%3a') ? decodeURIComponent(url) : url;

      if (url.includes('wc:')) {
        const loggedIn = await new LoggedIn(this.storage).value();
        this.wcService.set(new DefaultWCUri(url));
        if (!this.wcService.uri().isV2()) {
          this.walletConnectService.setUri(url);
          if (loggedIn) this.walletConnectService.checkDeeplinkUrl();
        } else if (this.isWalletConnectV2Enabled() && loggedIn) {
          await this.navController.navigateForward(['wallets/wallet-connect/new-connection']);
        }
      }
    }
  }

  private _statusBarConfig() {
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

  async showLoginModal() {
    if (!this.isModalOpen && this.appExpirationTimeService.getModalAvailability()) {
      this.isModalOpen = true;
      const loginModal = await this.modalController.create({
        component: LoginNewPage,
        cssClass: 'full-screen-modal',
        backdropDismiss: false,
        componentProps: {
          isExpirationModal: true,
        },
      });
      await loginModal.present();
      const { role } = await loginModal.onDidDismiss();
      this.isModalOpen = false;
      if (role === 'confirm') {
        await loginModal.dismiss();
      }
    }
  }

  isWalletConnectV2Enabled(): boolean {
    return this.remoteConfigService.getFeatureFlag('ff_walletConnectV2');
  }

  private _subscribeToFirebaseDynamicLinks() {
    this.firebaseDynamicLinks.addListener('deepLinkOpen', async (deepLink: DeepLinkOpen) => {
      const lender = new URL(deepLink.url).searchParams.get('lender');
      if (lender) {
        await new ActiveLender(this.storage).initialSave(lender, true);
        const lang = (await this._activeLender().value()).language();
        this.languageService.setLanguage(lang);
      }
    });
  }

  async ngOnDestroy() {
    await this.firebaseDynamicLinks.removeAllListeners();
  }
}
