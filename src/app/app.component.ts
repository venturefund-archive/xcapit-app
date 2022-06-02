import { Component, ElementRef, OnInit, NgZone } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
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
import { RemoteConfigService } from './shared/services/remote-config/remote-config.service';
import { FirebaseRemoteConfig } from './shared/models/firebase-remote-config/firebase-remote-config';
import { FirebaseService } from './shared/services/firebase/firebase.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { WalletConnectService } from './modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { IonicStorageService } from './shared/services/ionic-storage/ionic-storage.service';

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
    private navController: NavController,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef,
    private platformService: PlatformService,
    private updateNewsService: UpdateNewsService,
    private remoteConfigService: RemoteConfigService,
    private firebaseService: FirebaseService,
    private zone: NgZone,
    private walletConnectService: WalletConnectService,
    private ionicStorageService: IonicStorageService
  ) {}

  ngOnInit() {
    this.initializeFirebase();
    this.initializeRemoteConfig();
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
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.setLanguageSubscribe();
      this.checkDeeplinking();
    });
  }

  private async checkDeeplinking() {
    await this.walletConnectService.checkConnection();
    await this.walletConnectService.retrieveWalletConnect();

    if (this.platformService.isNative()) {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(async () => {
          const url = event.url.split("?uri=").pop();

          if (url) {
            this.walletConnectService.setUri(url);

            if (await this.authService.checkToken()) {
              this.walletConnectService.checkDeeplinkUrl();
            }
          }
        })
      });
    }
  }

  private initializeFirebase() {
    this.firebaseService.init();
  }

  private initializeRemoteConfig() {
    this.remoteConfigService.initialize(new FirebaseRemoteConfig(this.firebaseService.getApp())).then(() => {
      this.checkForUpdate();
      this.showUpdateModal();
      this.checkWalletProtected();
    });
  }

  async checkWalletProtected() {
    this.ionicStorageService.get('protectedWallet').then((protectedWallet) => {
      if (!protectedWallet) {
        this.ionicStorageService.set('backupWarningWallet', true);
      }
    });  
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

  async logout() {
    await this.ionicStorageService.set('backupWarningWallet', false);
    await this.authService.logout();
    await this.navController.navigateForward(['users/login']);
  }

  setLanguageSubscribe() {
    this.onLangChange = this.translate.onLangChange.subscribe(() => {
      this.updateLanguage();
    });
  }
}
