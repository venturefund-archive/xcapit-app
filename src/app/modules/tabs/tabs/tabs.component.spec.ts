import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { NavController } from '@ionic/angular';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';

fdescribe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TabsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let windowSpy: any;
  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [TabsComponent, FakeTrackClickDirective, DummyComponent],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'apikeys/tutorial', component: DummyComponent },
            { path: 'menus/main-menu', component: DummyComponent },
            { path: 'tabs/wallets', component: DummyComponent },
          ]),
        ],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Tab Home button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'Tab Home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Tab Wallet button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'Tab Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Tab Investments button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'Tab Investments');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Tab Menu button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'Tab Menu');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Investments Tab when Tab Investments clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="Tab Investments"]')).nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/investments']);
  });

  it('should navigate to Wallet Tab when Tab Wallet clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="Tab Wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should navigate to Menu Page when Tab Menu clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="Tab Menu"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/menus/main-menu']);
  });
});
