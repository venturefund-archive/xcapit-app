import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonTabs, NavController } from '@ionic/angular';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { PreviousRouteService } from '../../../shared/services/previous-route/previous-route.service';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TabsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activeTabSpy: jasmine.SpyObj<HTMLElement>;
  let ionTabsSpy: jasmine.SpyObj<IonTabs>;
  let previousRouteServiceSpy: jasmine.SpyObj<PreviousRouteService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    activeTabSpy = jasmine.createSpyObj('ActiveTab', { dispatchEvent: null });
    ionTabsSpy = jasmine.createSpyObj(
      'IonTabs',
      { getSelected: 'test' },
      { outlet: { activatedView: { element: null } } }
    );
    previousRouteServiceSpy = jasmine.createSpyObj('PreviousRouteService', { getPreviousUrl: 'previous-url' });
    TestBed.configureTestingModule({
      declarations: [TabsComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: PreviousRouteService, useValue: previousRouteServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.activeTab = activeTabSpy;
    component.tabs = ionTabsSpy;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Tab Home button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'ux_nav_go_to_home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Tab Tools button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'ux_nav_go_to_tools');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Tab Wallet button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-tab-button', 'ux_nav_go_to_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Tools Tab when Tab Tools clicked', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-tab-button[name="ux_nav_go_to_tools"]')).nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/tools']);
  });

  it('should navigate to Wallet Tab when Tab Wallet clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="ux_nav_go_to_wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should change tab', () => {
    fixture.debugElement.query(By.css('ion-tabs')).triggerEventHandler('ionTabsDidChange', null);
    expect(component.selectedCategory).toEqual('test');
  });

  ['ionViewWillEnter', 'ionViewDidEnter', 'ionViewWillLeave', 'ionViewDidLeave'].forEach((event) => {
    it(`should dispatch ${event}`, () => {
      component[event]();
      expect(activeTabSpy.dispatchEvent).toHaveBeenCalledWith(new CustomEvent(event));
    });
  });

  it(`should not dispatch event if no active tab`, () => {
    component.activeTab = null;
    component.ionViewDidEnter();
    expect(activeTabSpy.dispatchEvent).not.toHaveBeenCalled();
  });
});
