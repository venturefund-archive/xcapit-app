import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { GeneralPage } from './general.page';

describe('GeneralPage', () => {
  let component: GeneralPage;
  let fixture: ComponentFixture<GeneralPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let platformSpy: jasmine.SpyObj<Platform>;
  const router = { url: '/links/wc?uri=wc:test-url' };
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  const playStore = 'https://play.google.com/store/apps/details?id=com.xcapit.app';
  const appStore = 'https://apps.apple.com/ar/app/xcapit/id1545648148';

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      platformSpy = jasmine.createSpyObj('Platform', { is: false });
      browserServiceSpy = jasmine.createSpyObj('BrowserService', {
        open: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [ GeneralPage ],
        imports: [RouterTestingModule, IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: Platform, useValue: platformSpy },
          { provide: Router, useValue: router},
          { provide: BrowserService, useValue: browserServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(GeneralPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should check if platform is not mobileweb on ngOnInit', async () => {
    platformSpy.is.and.returnValue(false)
    component.ngOnInit();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/users/login-new');
  });

  it('should create the iOS URL Scheme when is an iOS platform', async () => {
    const spy = spyOn(component, 'redirectToUrl');
    platformSpy.is.and.returnValue(true);
    fixture.debugElement.query(By.css('ion-button[name="link_redirect"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.appURL).toEqual('xcapitApp://links/wc?uri=wc:test-url');
    expect(spy).toHaveBeenCalledWith('xcapitApp://links/wc?uri=wc:test-url');
  });

  it('should create the android URL Scheme when is an android platform', async () => {
    const spy = spyOn(component, 'redirectToUrl');
    platformSpy.is.and.returnValue(false);
    fixture.debugElement.query(By.css('ion-button[name="link_redirect"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.appURL).toEqual('wc:test-url');
    expect(spy).toHaveBeenCalledWith('wc:test-url');
  });

  it('should open app store url when download button is clicked and is an iOS platform', async () => {
    platformSpy.is.and.returnValue(false);
    fixture.debugElement.query(By.css('ion-button[name="link_store_download"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url:  appStore});
  });

  it('should open play store url when download button is clicked and is an android platform', async () => {
    platformSpy.is.and.returnValue(true);
    fixture.debugElement.query(By.css('ion-button[name="link_store_download"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url:  playStore});
  });
});
