import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TutorialsModule } from './modules/tutorials/tutorials.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FundsModule } from './modules/funds/funds.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TrackClickModule } from './shared/directives/track-click/track-click.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { TermsAndConditionsModule } from './modules/terms-and-conditions/terms-and-conditions.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TabsModule } from './modules/tabs/tabs.module';
import { ApikeysModule } from './modules/apikeys/apikeys.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { FiatRampsModule } from './modules/fiat-ramps/fiat-ramps.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AppStorageService } from './shared/services/app-storage/app-storage.service';
import { RefreshTokenInterceptorService } from './modules/usuarios/shared-usuarios/services/refresh-token-interceptor/refresh-token-interceptor.service';
import { AppInitializerFactory } from './shared/factories/app-initializer/app-initializer.factory';
import { updateServiceProvider } from './shared/providers/update/update.provider';
import { httpLoaderFactory } from './shared/factories/translate/translate.factory';
import { jwtOptionsFactory } from './shared/factories/jwt-options/jwt-options.factory';
import { WalletsModule } from './modules/wallets/wallets.module';
import { HomeModule } from './modules/home/home.module';
import { SupportModule } from './modules/support/support.module';
import { WealthManagementsModule } from './modules/wealth-managements/wealth-managements.module';
import { trackServiceProvider } from './shared/providers/track-service/track-service.provider';
import { DefiInvestmentsModule } from './modules/defi-investments/defi-investments.module';
import { FinancialPlannerModule } from './modules/financial-planner/financial-planner.module';
import { DonationsModule } from './modules/donations/donations.module';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

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
    FinancialPlannerModule,
    DonationsModule,
    SubscriptionsModule,
    TermsAndConditionsModule,
    ReferralsModule,
    TabsModule,
    ApikeysModule,
    NotificationsModule,
    WalletsModule,
    TicketsModule,
    FiatRampsModule,
    WalletsModule,
    HomeModule,
    SupportModule,
    WealthManagementsModule,
    DefiInvestmentsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AppStorageService],
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    WildcardRoutingModule, // always to last!
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true,
    },
    FileOpener,
    updateServiceProvider,
    trackServiceProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
