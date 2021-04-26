import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AUTH } from './config/app-constants.config';
import { TutorialsModule } from './modules/tutorials/tutorials.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FundsModule } from './modules/funds/funds.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { RunsModule } from './modules/runs/runs.module';
import { TrackClickModule } from './shared/directives/track-click/track-click.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { TermsAndConditionsModule } from './modules/terms-and-conditions/terms-and-conditions.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { TrackClickUnauthModule } from './shared/directives/track-click-unauth/track-click-unauth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TabsModule } from './modules/tabs/tabs.module';
import { ApikeysModule } from './modules/apikeys/apikeys.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { MenusModule } from './modules/menus/menus.module';
import { DepositAddressesModule } from './modules/deposit-addresses/deposit-addresses.module';
import { FiatRampsModule } from './modules/fiat-ramps/fiat-ramps.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { TicketsModule } from './modules/tickets/tickets.module';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => storage.get(AUTH.storageKey),
    allowedDomains: environment.whitelistedDomains,
  };
}

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonText: '',
      backButtonIcon: 'ux-back',
    }),
    IonicStorageModule.forRoot({
      name: '__xcapitdb',
      driverOrder: ['sqlite', 'indexeddb', 'websql'],
    }),
    AppRoutingModule,
    UsuariosModule,
    TutorialsModule,
    ProfilesModule,
    FundsModule,
    RunsModule,
    SubscriptionsModule,
    TermsAndConditionsModule,
    ReferralsModule,
    TabsModule,
    ApikeysModule,
    NotificationsModule,
    MenusModule,
    TicketsModule,
    DepositAddressesModule,
    FiatRampsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TrackClickModule,
    TrackClickUnauthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    WildcardRoutingModule, // always to last!
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
