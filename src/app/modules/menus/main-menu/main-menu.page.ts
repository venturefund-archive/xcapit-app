import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../../usuarios/shared-usuarios/services/auth/auth.service';
import { Plugins } from '@capacitor/core';
import { LanguageService } from '../../../shared/services/language/language.service';
import { UxSelectModalComponent } from '../../../shared/components/ux-select-modal/ux-select-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';
import { environment } from 'src/environments/environment';

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
            *ngIf="this.env === 'PREPROD' || (this.env === 'PRODUCCION' && p.showInProd)"
            class="menu-item"
            appTrackClick
            [dataToTrack]="{ eventLabel: p.url, description: 'sideMenu' }"
            [routerDirection]="p.routeDirection"
            [routerLink]="[p.url]"
            replaceUrl="true"
          >
            <ion-icon *ngIf="p.icon" class="icons" slot="start" [name]="p.icon"></ion-icon>
            <ion-label>
              {{ p.title | translate }}
            </ion-label>
          </ion-item>
        </div>
        <ion-item
          detail
          class="menu-item"
          appTrackClick
          [dataToTrack]="{
            eventLabel: 'Change Language',
            description: 'sideMenu'
          }"
          (click)="this.changeLanguage()"
        >
          <ion-icon slot="start" class="icons" name="ux-lenguage-icon"></ion-icon>
          <ion-label>
            {{ 'app.main_menu.change_language' | translate }}
          </ion-label>
        </ion-item>
        <ion-item
          class="menu-item"
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
  env = environment.environment;

  public appPages = [
    {
      id: 1,
      title: 'app.main_menu.funds',
      url: '/tabs/funds',
      icon: 'ux-myfund-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 2,
      title: 'funds.funds_finished.header',
      url: '/funds/funds-finished',
      icon: 'ux-finalizedfunds-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 3,
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: 'ux-user-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 4,
      title: 'app.main_menu.deposit_address',
      url: '/deposits/currency',
      icon: 'ux-book-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    // {
    //   id: 4,
    //   title: 'app.main_menu.commissions',
    //   url: '/funds/commissions',
    //   icon: 'wallet',
    //   routeDirection: 'forward',
    //   showInProd: false
    // },
    {
      id: 5,
      title: 'app.main_menu.help',
      url: '/tickets/create-support-ticket',
      icon: 'ux-settings-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 6,
      title: 'fiat_ramps.operations_list.header',
      url: '/menus/main-menu',
      icon: 'ux-buysell-icon',
      elementClick: 'buyCrypto',
      showInProd: false,
    },
    {
      id: 7,
      title: 'app.main_menu.password_change',
      url: '/users/password-change',
      icon: 'ux-key-icon',
      routeDirection: 'forward',
      showInProd: true,
    },
    {
      id: 8,
      title: 'app.main_menu.referrals',
      url: '/referrals/list',
      icon: 'ux-referrals-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 9,
      title: 'app.main_menu.notifications',
      url: '/notifications/list',
      icon: 'ux-notifications-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 10,
      title: 'app.main_menu.api_keys_managment',
      url: '/apikeys/list',
      icon: 'ux-cog-icon',
      routeDirection: 'root',
      showInProd: true,
    },
    {
      id: 11,
      title: 'app.main_menu.payment',
      url: '/payment/payment-methods',
      icon: 'ux-cash-icon',
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
