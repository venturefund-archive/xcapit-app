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


export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => storage.get(AUTH.storageKey),
    whitelistedDomains: ['localhost:9050']
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
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    UsuariosModule,
    TutorialsModule,
    ProfilesModule,
    FundsModule,
    SubscriptionsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
