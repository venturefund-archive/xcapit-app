import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription, Observable } from 'rxjs';
import {
  Router,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { LogsService } from './shared/services/logs/logs.service';
import { TrackClickDirective } from './shared/directives/track-click/track-click.directive';

@Component({
  selector: 'app-root',
  providers: [{ provide: TrackService, useClass: LogsService }],
  template: `
    <ion-app>
      <ion-split-pane>
        <ion-menu [disabled]="!(this.isLoggedIn$ | async)">
          <ion-header>
            <ion-toolbar>
              <ion-title>{{ 'app.main_menu.header' | translate }}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-list>
              <ion-menu-toggle
                auto-hide="false"
                *ngFor="let p of appPages; trackBy: this.trackBy"
              >
                <ion-item
                  appTrackClick
                  [dataToTrack]="{ eventLabel: p.url, description: 'sideMenu' }"
                  [routerDirection]="p.routeDirection"
                  [routerLink]="[p.url]"
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
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
          <ion-footer>
            <ion-menu-toggle auto-hide="false">
              <ion-item
                appTrackClick
                [dataToTrack]="{
                  eventLabel: 'Logout',
                  description: 'sideMenu'
                }"
                (click)="this.logout()"
              >
                <ion-icon slot="start" name="log-out" color="danger"></ion-icon>
                <ion-label>
                  {{ 'app.main_menu.logout' | translate }}
                </ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-footer>
        </ion-menu>
        <ion-router-outlet main></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(IonRouterOutlet) ionRouterOutlet: IonRouterOutlet;

  public appPages = [
    {
      id: 1,
      title: 'app.main_menu.funds',
      url: '/funds/list',
      icon: '',
      routeDirection: 'root'
    },
    {
      id: 2,
      title: 'app.main_menu.user_profile',
      url: '/profiles/user',
      icon: '',
      routeDirection: 'forward'
    },
    {
      id: 3,
      title: 'app.main_menu.deposit_address',
      url: '/funds/deposit-address',
      icon: '',
      routeDirection: 'forward'
    },
    {
      id: 4,
      title: 'app.main_menu.commissions',
      url: '/funds/commissions',
      icon: '',
      routeDirection: 'forward'
    },
    {
      id: 5,
      title: 'app.main_menu.help',
      url: '/tutorials/help',
      icon: '',
      routeDirection: 'forward'
    },
    {
      id: 6,
      title: 'app.main_menu.password_change',
      url: '/users/password-change',
      icon: '',
      routeDirection: 'forward'
    },
    {
      id: 7,
      title: 'app.main_menu.referrals',
      url: '/referrals/list',
      icon: '',
      routeDirection: 'root'
    }
  ];

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn;

  routerNavEndSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private trackService: TrackService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.routeChangeSubscribe();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
    this.trackLoad();
  }

  trackLoad() {
    this.trackService.trackEvent({
      eventAction: 'load',
      description: window.location.href
    });
  }

  ngOnDestroy() {
    this.routerNavEndSubscription.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['users/login']);
  }

  routeChangeSubscribe() {
    this.routerNavEndSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary')
      )
      .subscribe(() => {
        this.trackService.trackView({
          pageUrl: window.location.href,
          screenName: this.ionRouterOutlet.activatedRoute.routeConfig.component
            .name,
          eventAction: 'nav'
        });
        this.submitButtonService.enabled();
      });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
