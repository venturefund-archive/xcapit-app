import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';

@Component({
  selector: 'app-root',
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
        </ion-menu>
        <ion-router-outlet main></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `
})
export class AppComponent implements OnInit, OnDestroy {
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
      customIcon: '',
      routeDirection: 'forward'
    }
  ];

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn;

  routerEventSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.routeChangeSubscribe();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  routeChangeSubscribe() {
    this.routerEventSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(() => {
        this.submitButtonService.enabled();
      });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
