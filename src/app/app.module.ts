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
import { UsersModule } from './modules/users/users.module';
import { TutorialsModule } from './modules/tutorials/tutorials.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TrackClickModule } from './shared/directives/track-click/track-click.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TabsModule } from './modules/tabs/tabs.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { FiatRampsModule } from './modules/fiat-ramps/fiat-ramps.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AppStorageService } from './shared/services/app-storage/app-storage.service';
import { RefreshTokenInterceptorService } from './modules/users/shared-users/services/refresh-token-interceptor/refresh-token-interceptor.service';
import { languageInitializer } from './shared/factories/app-initializers/language/language-initializer';
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
import { FinancialEducationModule } from './modules/financial-education/financial-education.module';
import { SwapsModule } from './modules/swaps/swaps.module';
import { LinksModule } from './modules/links/links.module';
import { XAuthTokenInterceptorService } from './modules/users/shared-users/services/x-auth-token-interceptor/x-auth-token-interceptor.service';
import { RemoteConfigService } from './shared/services/remote-config/remote-config.service';
import { FirebaseService } from './shared/services/firebase/firebase.service';
import { firebaseInitializer } from './shared/factories/app-initializers/firebase/firebase-initializer';
import { ContactsModule } from './modules/contacts/contacts.module';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

@NgModule({
  declarations: [AppComponent],
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
    UsersModule,
    TutorialsModule,
    ProfilesModule,
    FinancialEducationModule,
    FinancialPlannerModule,
    DonationsModule,
    SubscriptionsModule,
    ReferralsModule,
    TabsModule,
    NotificationsModule,
    WalletsModule,
    TicketsModule,
    FiatRampsModule,
    WalletsModule,
    HomeModule,
    LinksModule,
    SupportModule,
    WealthManagementsModule,
    DefiInvestmentsModule,
    SwapsModule,
    ContactsModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XAuthTokenInterceptorService,
      multi: true,
    },
    updateServiceProvider,
    trackServiceProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializer,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: firebaseInitializer,
      deps: [RemoteConfigService, FirebaseService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
