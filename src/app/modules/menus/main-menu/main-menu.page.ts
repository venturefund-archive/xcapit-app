import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../../usuarios/shared-usuarios/services/auth/auth.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { UxSelectModalComponent } from '../../../shared/components/ux-select-modal/ux-select-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { environment } from 'src/environments/environment';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';

@Component({
  selector: 'app-main-menu',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'app.main_menu.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <div *ngFor="let p of appPages; trackBy: this.trackBy" (click)="this.clickAction(p)">
          <ion-item
            *ngIf="this.env === 'PREPROD' || (this.env === 'PRODUCCION' && p.showInProd)"
            class="menu-item ux-font-text-xs"
            [id]="p.name"
            appTrackClick
            [dataToTrack]="{ eventLabel: p.url, description: 'sideMenu' }"
          >
            <ion-icon *ngIf="p.icon" class="icons" slot="start" [name]="p.icon"> aria-hidden= “true” </ion-icon>
            <ion-label>
              {{ p.title | translate }}
            </ion-label>
          </ion-item>
        </div>
        <ion-item
          detail
          class="menu-item  ux-font-text-xs"
          appTrackClick
          id="ChangeLanguage"
          [dataToTrack]="{
            eventLabel: 'Change Language',
            description: 'sideMenu'
          }"
          (click)="this.changeLanguage()"
        >
          <ion-icon slot="start" class="icons" name="ux-lenguage-icon"> </ion-icon>
          <ion-label>
            {{ 'app.main_menu.change_language' | translate }}
          </ion-label>
        </ion-item>
        <ion-item
          class="menu-item  ux-font-text-xs"
          appTrackClick
          [dataToTrack]="{
            eventLabel: 'Logout',
            description: 'sideMenu'
          }"
          (click)="this.logout()"
        >
          <ion-icon slot="start" class="icons" name="ux-logout-icon"></ion-icon>
          <ion-label>
            {{ 'app.main_menu.logout' | translate }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage implements OnInit {
  apikeys: any = [];
  userHasOperations: boolean;
  env = environment.environment;

  public appPages = [
    {
      id: 1,
      name: 'Profile',
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: 'ux-user-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 2,
      name: 'Funds',
      title: 'app.main_menu.funds',
      url: '/tabs/investments/binance',
      icon: 'ux-myfund-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 3,
      name: 'FundsFinished',
      title: 'funds.funds_finished.header',
      url: '/funds/funds-finished',
      icon: 'ux-finalizedfunds-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 4,
      name: 'Support',
      title: 'app.main_menu.help',
      url: '/support/options',
      icon: 'ux-settings-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 5,
      name: 'RecoveryPhrase',
      title: 'app.main_menu.recovery_phrase',
      url: '/wallets/recovery/info',
      icon: 'ux-lock',
      elementClick: 'recoveryPhrase',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 6,
      name: 'BuyCrypto',
      title: 'fiat_ramps.operations_list.header',
      url: '/fiat-ramps/operations',
      icon: 'ux-buysell-icon',
      elementClick: 'buyCrypto',
      showInProd: true,
    },
    {
      id: 7,
      name: 'PasswordChange',
      title: 'app.main_menu.password_change',
      url: '/users/password-change',
      icon: 'ux-key-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 8,
      name: 'Referrals',
      title: 'app.main_menu.referrals',
      url: '/referrals/summary',
      icon: 'ux-referrals-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 9,
      name: 'Notifications',
      title: 'app.main_menu.notifications',
      url: '/notifications/list',
      icon: 'ux-notifications-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 10,
      name: 'ApiKeysList',
      title: 'app.main_menu.api_keys_managment',
      url: '/apikeys/list',
      icon: 'ux-cog-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 11,
      name: 'Payments',
      title: 'app.main_menu.payment',
      url: '/payment/select-license',
      icon: 'ux-cash-icon',
      routeDirection: 'forward',
      showInProd: false,
    },
    {
      id: 12,
      name: 'WalletConnect',
      title: 'app.main_menu.wallet_connect',
      url: '/wallets/wallet-connect/new-connection',
      icon: 'wallet-connect-icon',
      elementClick: 'walletconnect',
      routeDirection: 'forward',
      showInProd: false,
    },
  ];

  constructor(
    private apiApikeysService: ApiApikeysService,
    private authService: AuthService,
    private language: LanguageService,
    private translate: TranslateService,
    private modalController: ModalController,
    private apiFiatRampsService: FiatRampsService,
    public navController: NavController,
    private walletService: WalletService,
    private walletConnectService: WalletConnectService
  ) {}

  ngOnInit() {
    this.navController.consumeTransition();
  }

  ionViewWillEnter() {
    this.getAllApiKeys();
    this.getUserHasOperations();
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  async logout() {
    await this.authService.logout();
    await this.navController.navigateRoot('users/login');
  }

  async changeLanguage() {
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant('app.main_menu.change_language'),
        data: this.language.getLanguages(),
        keyName: 'text',
        valueName: 'value',
        selected: this.language.selected,
      },
      cssClass: 'ux_modal_crm',
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.role === 'selected') {
      this.language.setLanguage(data.data);
    }
  }

  getAllApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      this.apikeys = data;
    });
  }

  getUserHasOperations() {
    this.apiFiatRampsService.userHasOperations().subscribe((data) => {
      this.userHasOperations = data.user_has_operations;
    });
  }

  hasApiKeysOrOperations() {
    return this.apikeys.length > 0 || this.userHasOperations === true;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: InformativeModalComponent,
      cssClass: 'ux-modal-informative',
      swipeToClose: false,
    });
    await modal.present();
  }

  async clickAction(item) {
    let url = item.url;
    if (item.elementClick === 'buyCrypto' && !this.hasApiKeysOrOperations()) {
      await this.openModal();
      return;
    }
    if (item.elementClick === 'recoveryPhrase' && !(await this.walletService.walletExist())) {
      url = '/wallets/recovery/info-no-wallet';
    }
    if (item.elementClick === 'walletconnect') {
      if (!(await this.walletService.walletExist())) {
        url = 'tabs/wallets';
      } else {
        if (this.walletConnectService.connected) {
          url = 'wallets/wallet-connect/connection-detail';
        }
      }
    }

    this.navController.navigateForward(url);
  }
}
