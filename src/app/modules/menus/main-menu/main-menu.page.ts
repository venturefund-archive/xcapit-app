import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../../usuarios/shared-usuarios/services/auth/auth.service';
import { Plugins } from '@capacitor/core';
import { LanguageService } from '../../../shared/services/language/language.service';
import { UxSelectModalComponent } from '../../../shared/components/ux-select-modal/ux-select-modal.component';
import { TranslateService } from '@ngx-translate/core';

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
                  <ion-item class="item-style"
                            appTrackClick
                            [dataToTrack]="{ eventLabel: p.url, description: 'sideMenu' }"
                            [routerDirection]="p.routeDirection"
                            [routerLink]="[p.url]"
                            replaceUrl=true
                  >
                      <ion-icon
                              *ngIf="p.icon"
                              slot="start"
                              [name]="p.icon"
                      ></ion-icon>
                      <ion-label>
                          {{ p.title | translate }}
                      </ion-label>
                  </ion-item>
              </div>
              <ion-item detail class="item-style"
                        appTrackClick
                        [dataToTrack]="{
                            eventLabel: 'Change Language',
                            description: 'sideMenu'
                        }"
                        (click)="this.changeLanguage()"
              >
                  <ion-icon slot="start" name="globe-outline"></ion-icon>
                  <ion-label>
                      {{ 'app.main_menu.change_language' | translate }}
                  </ion-label>
              </ion-item>
              <ion-item class="item-style"
                        appTrackClick
                        [dataToTrack]="{
            eventLabel: 'Logout',
            description: 'sideMenu'
          }"
                        (click)="this.logout()"
              >
                  <ion-icon slot="start" name="log-out"></ion-icon>
                  <ion-label>
                      {{ 'app.main_menu.logout' | translate }}
                  </ion-label>
              </ion-item>
          </ion-list>
      </ion-content>
  `,
  styleUrls: ['./main-menu.page.scss']
})
export class MainMenuPage implements OnInit {

  public appPages = [
    {
      id: 1,
      title: 'app.main_menu.funds',
      url: '/tabs/funds',
      icon: 'trending-up',
      routeDirection: 'root'
    },
    {
      id: 2,
      title: 'Mis fondos finalizados',
      url: '/funds/funds-finished',
      icon: 'film',
      routeDirection: 'forward'
    },
    {
      id: 3,
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: 'person',
      routeDirection: 'forward'
    },
    {
      id: 4,
      title: 'app.main_menu.deposit_address',
      url: '/deposits/currency',
      icon: 'journal',
      routeDirection: 'forward'
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
      icon: 'help-circle-outline',
      routeDirection: 'forward',
      elementClick: 'openTutorials'
    },
    {
      id: 6,
      title: 'app.main_menu.password_change',
      url: '/users/password-change',
      icon: 'key',
      routeDirection: 'forward'
    },
    {
      id: 7,
      title: 'app.main_menu.referrals',
      url: '/referrals/list',
      icon: 'people',
      routeDirection: 'root'
    },
    {
      id: 8,
      title: 'app.main_menu.notifications',
      url: '/notifications/list',
      icon: 'notifications-outline',
      routeDirection: 'root'
    }
  ];

  constructor(
    private authService: AuthService,
    private language: LanguageService,
    private translate: TranslateService,
    private modalController: ModalController,
    public navController: NavController
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/']
    });
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
        selected: this.language.selected
      },
      cssClass: 'ux_modal_crm'
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.role === 'selected') {
      this.language.setLanguage(data.data);
    }
  }

  async clickAction(element) {
    if (element === 'openTutorials') {
      await Browser.open(
        {
          toolbarColor: '#ff9100',
          url: 'https://www.info.xcapit.com/'
        }
      );
    }
  }

}
