import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../usuarios/shared-usuarios/services/auth/auth.service';
import { Plugins } from '@capacitor/core';

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
        <div *ngFor="let p of appPages; trackBy: this.trackBy" (click)="this.clickAction(p.elementClick)" >
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
        <ion-item class="item-style"
          appTrackClick
          [dataToTrack]="{
            eventLabel: 'Logout',
            description: 'sideMenu'
          }"
          (click)="this.logout()"
        >
          <ion-icon slot="start" name="log-out" ></ion-icon>
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
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: 'person',
      routeDirection: 'forward'
    },
    {
      id: 3,
      title: 'app.main_menu.deposit_address',
      url: '/deposits/currency',
      icon: 'journal',
      routeDirection: 'forward'
    },
    {
      id: 4,
      title: 'app.main_menu.commissions',
      url: '/funds/commissions',
      icon: 'wallet',
      routeDirection: 'forward'
    },
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
    private router: Router,
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
    this.router.navigate(['users/login']);
  }

  async clickAction(element) {
    if(element === 'openTutorials') {
      await Browser.open({ toolbarColor:"#ff9100", url: 'https://www.info.xcapit.com/' });
    }
  }

}
