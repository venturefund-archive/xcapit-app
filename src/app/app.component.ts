import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-split-pane>
        <ion-menu [disabled]="true">
          <ion-header>
            <ion-toolbar>
              <ion-title>Menu</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-list>
              <ion-menu-toggle auto-hide="false" *ngFor="let p of appPages">
                <ion-item [routerDirection]="'root'" [routerLink]="[p.url]">
                  <ion-icon slot="start" [name]="p.icon"></ion-icon>
                  <ion-label>
                    {{ p.title }}
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
  public appPages = [];

  routerEventSubscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private submitButtonService: SubmitButtonService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.routeChangeSubscribe();
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
}
