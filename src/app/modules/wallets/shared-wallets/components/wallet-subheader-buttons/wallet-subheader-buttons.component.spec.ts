import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletSubheaderButtonsComponent } from './wallet-subheader-buttons.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';

describe('WalletSubheaderButtonsComponent', () => {
  let component: WalletSubheaderButtonsComponent;
  let fixture: ComponentFixture<WalletSubheaderButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletSubheaderButtonsComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletSubheaderButtonsComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletSubheaderButtonsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render send card', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsb__card-buttons__send-card'));
    expect(div).not.toBeNull();
  });

  it('should render performance card', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsb__card-buttons__performance'));
    expect(div).not.toBeNull();
  });

  it('should call trackEvent on trackService when ux_send_go_to_send Button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_send_go_to_send');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go to Receive Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Receive');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go to Buy Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Buy');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go to Performance Button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Performance');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Send page when ux_send_go_to_send is clicked from HomeWalletPage', () => {
    component.asset = '';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_send_go_to_send');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/send/select-currency']);
  });

  it('should navigate to Send page of an specific asset when ux_send_go_to_send is clicked from AssetDetailPage', () => {
    component.asset = 'USDT';
    component.network = 'ERC20';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_send_go_to_send');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
      ['wallets/send/detail'],
      Object({ queryParams: Object({ asset: 'USDT', network: 'ERC20' }) })
    );
  });

  it('should navigate to receive page with the default asset selected when Go to Receive is clicked from HomeWalletPage', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Receive');
    component.asset = '';
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/receive/select-currency']);
  });

  it('should navigate to receive page with an asset selected when Go to Receive is clicked from AssetDetailPage', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Receive');
    component.asset = 'LINK';
    component.network = 'ERC20';
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['wallets/receive/detail'],
      Object({ queryParams: Object({ asset: 'LINK', network: 'ERC20' }) })
    );
  });

  it('should navigate to tabs/investments when Go to Performance button is clicked', async () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Performance']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/investments']);
  });

  it('should navigate to fiat-ramps moonpay page when Go to Buy button is clicked', async () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Buy']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/moonpay']);
  });
});
