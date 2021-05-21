import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../../usuarios/shared-usuarios/services/auth/auth.service';
import { Plugins } from '@capacitor/core';
import { LanguageService } from '../../../shared/services/language/language.service';
import { UxSelectModalComponent } from '../../../shared/components/ux-select-modal/ux-select-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';

const { Browser } = Plugins;

@Component({
  selector: 'app-main-menu',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'app.main_menu.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <div *ngFor="let p of appPages; trackBy: this.trackBy" (click)="this.clickAction(p.elementClick)">
          <ion-item
            class="item-style"
            appTrackClick
            [dataToTrack]="{ eventLabel: p.url, description: 'sideMenu' }"
            [routerDirection]="p.routeDirection"
            [routerLink]="[p.url]"
            replaceUrl="true"
          >
            <!-- <ion-icon *ngIf="p.icon" slot="start" [name]="p.icon"></ion-icon> -->
            <img [src]="p.icon" slot="start" class="icons" alt="Menu Icon" />
            <ion-label>
              {{ p.title | translate }}
            </ion-label>
          </ion-item>
        </div>
        <ion-item
          detail
          class="item-style"
          appTrackClick
          [dataToTrack]="{
            eventLabel: 'Change Language',
            description: 'sideMenu'
          }"
          (click)="this.changeLanguage()"
        >
          <img src="../assets/ux-icons/ux-lenguage-icon.svg" class="icons" slot="start" alt="Menu Icon" />
          <ion-label>
            {{ 'app.main_menu.change_language' | translate }}
          </ion-label>
        </ion-item>
        <ion-item
          class="item-style"
          appTrackClick
          [dataToTrack]="{
            eventLabel: 'Logout',
            description: 'sideMenu'
          }"
          (click)="this.logout()"
        >
          <img src="../assets/ux-icons/ux-logout-icon.svg" class="icons" slot="start" alt="Menu Icon" />
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

  public appPages = [
    {
      id: 1,
      title: 'app.main_menu.funds',
      url: '/tabs/funds',
      icon: '../assets/ux-icons/ux-myFund-icon.svg',
      routeDirection: 'root',
    },
    {
      id: 2,
      title: 'funds.funds_finished.header',
      url: '/funds/funds-finished',
      icon: '../assets/ux-icons/ux-finalizedFunds-icon.svg',
      routeDirection: 'forward',
    },
    {
      id: 3,
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: '../assets/ux-icons/ux-user-icon.svg',
      routeDirection: 'forward',
    },
    {
      id: 4,
      title: 'app.main_menu.deposit_address',
      url: '/deposits/currency',
      icon: '../assets/ux-icons/ux-depositDirection-icon.svg',
      routeDirection: 'forward',
    },
    /*{
      id: 4,
      title: 'app.main_menu.commissions',
      url: '/funds/commissions',
      icon: 'wallet',
      routeDirection: 'forward'
    },*/
    {
      id: 5,
      title: 'app.main_menu.help',
      url: '/tabs/funds',
      icon: '../assets/ux-icons/ux-settings-icon.svg',
      routeDirection: 'forward',
      elementClick: 'openTutorials',
    },
    {
      id: 6,
      title: 'Comprar/Vender cryptos',
      url: '/menus/main-menu',
      icon: '../assets/ux-icons/ux-buySellCrypto-icon.svg',
      elementClick: 'buyCrypto',
    },
    {
      id: 7,
      title: 'app.main_menu.password_change',
      url: '/users/password-change',
      icon: '../assets/ux-icons/ux-key-icon.svg',
      routeDirection: 'forward',
    },
    {
      id: 8,
      title: 'app.main_menu.referrals',
      url: '/referrals/list',
      icon: '../assets/ux-icons/ux-referrals-icon.svg',
      routeDirection: 'root',
    },
    {
      id: 9,
      title: 'app.main_menu.notifications',
      url: '/notifications/list',
      icon: '../assets/ux-icons/ux-notifications-icon.svg',
      routeDirection: 'root',
    },
    {
      id: 10,
      title: 'app.main_menu.api_keys_managment',
      url: '/apikeys/list',
      icon: '../assets/ux-icons/ux-cog-icon.svg',
      routeDirection: 'root',
    },
    {
      id: 11,
      title: 'app.main_menu.payment',
      url: '/payment/payment-methods',
      icon: '../assets/ux-icons/ux-cash-icon.svg',
      routeDirection: 'forward',
    },
  ];

  constructor(
    private apiApikeysService: ApiApikeysService,
    private authService: AuthService,
    private language: LanguageService,
    private translate: TranslateService,
    private modalController: ModalController,
    public navController: NavController
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/'],
    });
    this.getAllApiKeys();
  }

  ngOnInit() {
    this.navController.consumeTransition();
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

  checkEmptyApiKeys() {
    if (this.apikeys.length === 0) {
      this.openModal();
    } else {
      this.navController.navigateForward('/fiat-ramps/operations');
    }
  }

  getAllApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      this.apikeys = data;
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: InformativeModalComponent,
      cssClass: 'ux-modal-informative',
      swipeToClose: false,
    });
    await modal.present();
  }

  async clickAction(element) {
    if (element === 'openTutorials') {
      await Browser.open({
        toolbarColor: '#ff9100',
        url: 'https://www.info.xcapit.com/',
      });
    }
    if (element === 'buyCrypto') {
      this.checkEmptyApiKeys();
    }
  }
}
