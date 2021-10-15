import { Component, ElementRef, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { LanguageService } from './shared/services/language/language.service';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private trackService: TrackService,
    private updateService: UpdateService,
    private translate: TranslateService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.submitButtonService.enabled();
    this.loadingService.enabled();
    this.trackService.startTracker();
    this.checkForUpdate();
  }

  private checkForUpdate() {
    this.updateService.checkForUpdate();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.onLangChange = this.translate.onLangChange.subscribe(() => {
        this.updateLanguage();
      });
    });
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
}
