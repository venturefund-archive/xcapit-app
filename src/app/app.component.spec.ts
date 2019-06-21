import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: any;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
      ],
      imports: [ RouterTestingModule.withRoutes([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  }));

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call ngOnInit', async () => {
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app, 'ngOnInit');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call routeChangeSubscribe from ngOnInit', async () => {
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app, 'routeChangeSubscribe');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('routerEventSubscription should not be null after ngOnInit call', async () => {
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app.routerEventSubscription).not.toBeNull();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });
});
