import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { LogsService } from './shared/services/logs/logs.service';
import { PublicLogsService } from './shared/services/public-logs/public-logs.service';
import { NotificationsService } from './modules/notifications/shared-notifications/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { NotificationsHelperService } from './modules/notifications/shared-notifications/services/notifications-helper/notifications-helper.service';
import { UpdatePWAService } from './shared/services/update-pwa/update-pwa.service';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-root',
  providers: [{ provide: TrackService, useClass: LogsService }],
  template: `
      <ion-app>
          <ion-split-pane contentId="main-content">
              <ion-router-outlet id="main-content"></ion-router-outlet>
          </ion-split-pane>
      </ion-app>
  `
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonRouterOutlet, { static: true })
  ionRouterOutlet: IonRouterOutlet;

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn;

  routerNavEndSubscription: Subscription;
  updateAppSubscription: Subscription;

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
    private trackService: TrackService,
    private publicLogsService: PublicLogsService,
    private notificationsService: NotificationsService,
    private notificationsHelper: NotificationsHelperService,
    private updatePWAService: UpdatePWAService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.routeChangeSubscribe();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
    this.trackLoad();
  }

  async ngAfterViewInit() {
    await this.updateApp();
  }

  initNotifications() {
    const notifications = this.notificationsService.getInstance();
    notifications.init(() =>
      console.error('Error inicializando notificaciones')
    );
  }

  private async updateApp() {
    this.updateAppSubscription = this.updatePWAService.update().subscribe();
  }

  private unsubscribeUpdateAppSubscription() {
    if (!!this.updateAppSubscription) {
      this.updateAppSubscription.unsubscribe();
    }
  }

  private unsubscribeRouterNavEndSubscription() {
    if (!!this.routerNavEndSubscription) {
      this.routerNavEndSubscription.unsubscribe();
    }
  }

  trackLoad() {
    if (!this.isUnauthRoute()) {
      this.trackService.trackEvent({
        eventAction: 'load',
        description: window.location.href
      });
    } else {
      this.publicLogsService.trackEvent({
        eventAction: 'load',
        description: window.location.href
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeUpdateAppSubscription();
    this.unsubscribeRouterNavEndSubscription();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initNotifications();
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
        this.trackNav();
        this.submitButtonService.enabled();
      });
  }

  private trackNav() {
    if (!this.isUnauthRoute()) {
      this.trackService.trackView({
        pageUrl: window.location.href,
        screenName: this.ionRouterOutlet.activatedRoute.routeConfig.component
          .name,
        eventAction: 'nav'
      });
    } else {
      this.publicLogsService.trackView({
        pageUrl: window.location.href,
        screenName: this.ionRouterOutlet.activatedRoute.routeConfig.component
          .name,
        eventAction: 'nav'
      });
    }
  }

  isUnauthRoute(): number {
    return [
      '/users/login',
      '/users/register',
      '/users/email-validation',
      '/users/reset-password',
      '/users/success-reset',
      '/users/success-register'
    ].filter(item => {
      const regex = new RegExp(item, 'gi');
      const pathname = window.location.pathname;
      return pathname.match(regex) || pathname.length === 1;
    }).length;
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
