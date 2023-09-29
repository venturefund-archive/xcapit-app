import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './modules/users/users.module';
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
import { NoConnectionBannerComponent } from './shared/components/no-connection-banner/no-connection-banner.component';
import { WarrantiesModule } from './modules/warranties/warranties.module';
import { KriptonLogOutInterceptorService } from './modules/fiat-ramps/shared-ramps/services/kripton-log-out-interceptor/kripton-log-out-interceptor.service';
import { firebasePushNotificationsInitializer } from './shared/factories/app-initializers/firebase/firebase-push-notifications-initializer';
import { NotificationsService } from './modules/notifications/shared-notifications/services/notifications/notifications.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { storageInitializer } from './shared/factories/app-initializers/storage/storage-initializer';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

@NgModule({
  declarations: [AppComponent, NoConnectionBannerComponent],
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
      driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    AppRoutingModule,
    UsersModule,
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
    LinksModule,
    SupportModule,
    WealthManagementsModule,
    DefiInvestmentsModule,
    SwapsModule,
    ContactsModule,
    WarrantiesModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KriptonLogOutInterceptorService,
      multi: true,
    },
    updateServiceProvider,
    trackServiceProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: storageInitializer,
      deps: [Storage],
      multi: true,
    },
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
    {
      provide: APP_INITIALIZER,
      useFactory: firebasePushNotificationsInitializer,
      deps: [NotificationsService],
      multi: true,
    },
    
  ],
  bootstrap: [AppComponent],
  exports: [NoConnectionBannerComponent],
})
export class AppModule {}
