import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TabsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [TabsComponent, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, TranslateModule.forRoot()],
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

  it('should navigate to Investments Tab when Tab Investments clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="Tab Investments"]')).nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/investments']);
  });

  it('should navigate to Wallet Tab when Tab Wallet clicked', () => {
    fixture.debugElement.query(By.css('ion-tab-button[name="Tab Wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });
});
