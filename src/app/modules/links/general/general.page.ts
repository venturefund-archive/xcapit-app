import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  template: `
    <ion-content>
      <iframe style="display:none" height="0" width="0" id="loader"></iframe>
      <div class="links">
        <app-xcapit-logo [whiteLogo]="true" divClass="links__logo"></app-xcapit-logo>

        <ion-text class="ux-font-text-xl ion-padding-top ion-margin-top">{{ 'links.title' | translate }}</ion-text>

        <div class="links__redirect ion-padding-top ion-margin-top">
          <ion-text class="ux-font-text-base">{{ 'links.have_app' | translate }}</ion-text>
          <ion-button
            expand="block"
            size="large"
            type="submit"
            class="ux_button"
            name="link_redirect"
            color="secondary"
            (click)="this.openApp()"
          >
          {{ 'links.go_to_xcapit' | translate }}
          </ion-button>
        </div>
        
        <div class="links__redirect ion-padding-top ion-margin-top">
          <ion-text class="ux-font-text-base">{{ 'links.dont_have_app' | translate }}</ion-text>
          <ion-button
            expand="block"
            size="large"
            type="submit"
            class="links__redirect__button ux_button"
            name="link_store_download"
            color="primary"
            (click)="this.redirectToStore()"
          >
            <ion-icon icon="ux-arrow-narrow-down" class="links__redirect__button__icon"></ion-icon>
            {{ 'links.download' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {
  appURL: string;

  constructor(
    private platform: Platform,
    private browserService: BrowserService,
    private navController: NavController,
    private route: Router,
  ) { }

  ngOnInit() {
    if (!this.platform.is('mobileweb')) {
      this.navController.navigateForward('/users/login-new');
    }
  }

  openApp() {
    const path = this.route.url.toString()
    
    if (this.platform.is('ios')) {
      this.appURL = 'xcapitApp:/' + path;
    } else {
      this.appURL = path.split('?uri=').pop();
    }

    this.redirectToUrl(this.appURL);
  }

  redirectToUrl(url: string) {
    document.location.href = url;
  }

  redirectToStore() {
    const storeURL = this.platform.is('android')
      ? 'https://play.google.com/store/apps/details?id=com.xcapit.app'
      : 'https://apps.apple.com/ar/app/xcapit/id1545648148';

      this.browserService.open({ url: storeURL });
  }
}
