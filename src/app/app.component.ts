import { Component, ElementRef, OnInit, NgZone } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/users/shared-users/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@capacitor/status-bar';
import { PlatformService } from './shared/services/platform/platform.service';
import { CONFIG } from './config/app-constants.config';
import { UpdateNewsService } from './shared/services/update-news/update-news.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { WalletConnectService } from './modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletBackupService } from './modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LocalNotificationsService } from './modules/notifications/shared-notifications/services/local-notifications/local-notifications.service';

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

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef,
    private platformService: PlatformService,
    private updateNewsService: UpdateNewsService,
    private zone: NgZone,
    private walletConnectService: WalletConnectService,
    private walletBackupService: WalletBackupService,
    private localNotificationsService: LocalNotificationsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.statusBarConfig();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
    this.trackService.startTracker();
  }

  private showUpdateModal() {
    this.updateNewsService.showModal();
  }

  private checkForUpdate() {
    this.updateService.checkForUpdate();
  }

  private initializeApp() {
    this.checkForUpdate();
    this.showUpdateModal();
    this.walletBackupService.getBackupWarningWallet();
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.setLanguageSubscribe();
      this.checkWalletConnectAndDynamicLinks();
      this.localNotificationsService.init();
    });
  }

  private async checkWalletConnectAndDynamicLinks() {
    await this.walletConnectService.checkConnection();
    await this.walletConnectService.retrieveWalletConnect();

    if (this.platformService.isNative()) {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(async () => {
          this.walletConnectDeepLinks(event);
          this.dynamicLinks(event);
        });
      });
    }
  }

  dynamicLinks(event) {
    const dynamicLinkURL = event.url.split('app.xcapit.com/').pop();
    if (dynamicLinkURL) this.navController.navigateForward(dynamicLinkURL);
  }

  async walletConnectDeepLinks(event) {
    const url = event.url.split('?uri=').pop();
    if (url) {
      this.walletConnectService.setUri(url);

      if (await this.authService.checkToken()) {
        this.walletConnectService.checkDeeplinkUrl();
      }
    }
  }

  private statusBarConfig() {
    if (this.platformService.platform() === 'android') {
      this.statusBar.setBackgroundColor({ color: CONFIG.app.statusBarColor });
    }
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
