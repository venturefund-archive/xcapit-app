import { Component, ElementRef, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@capacitor/status-bar';
import { PlatformService } from './shared/services/platform/platform.service';
import { CONFIG } from './config/app-constants.config';
import { UpdateNewsService } from './shared/services/update-news/update-news.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-split-pane contentId="main-content">
        <ion-router-outlet id="main-content"></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  onLangChange: Subscription = undefined;
  statusBar = StatusBar;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private navController: NavController,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef,
    private platformService: PlatformService,
    private updateNewsService: UpdateNewsService
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.statusBarConfig();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
    this.trackService.startTracker();
    this.checkForUpdate();
  }

  private showUpdateModal() {
    this.updateNewsService.showModal();
  }

  private checkForUpdate() {
    this.updateService.checkForUpdate();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.showUpdateModal();
      this.languageService.setInitialAppLanguage();
      this.setLanguageSubscribe();
    });
  }

  private statusBarConfig() {
    if (this.platformService.platform() === 'android') {
      this.statusBar.setBackgroundColor({ color: CONFIG.app.statusBarColor });
    }
  }

  updateLanguage(): void {
    const lang = document.createAttribute('lang');
    lang.value = this.translate.currentLang;
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
  }

  async logout() {
    await this.authService.logout();
    await this.navController.navigateForward(['users/login']);
  }

  setLanguageSubscribe() {
    this.onLangChange = this.translate.onLangChange.subscribe(() => {
      this.updateLanguage();
    });
  }
}
