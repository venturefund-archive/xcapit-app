import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { WalletSubheaderButtonsComponent } from './wallet-subheader-buttons.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WalletSubheaderButtonsComponent', () => {
  let component: WalletSubheaderButtonsComponent;
  let fixture: ComponentFixture<WalletSubheaderButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletSubheaderButtonsComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [WalletSubheaderButtonsComponent, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
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

  it('should render send card when hasTransactions is true', () => {
    component.hasTransactions = true;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__card-buttons__send-card'));
    expect(div).not.toBeNull();
  });

  it('should not render send card when hasTransactions is false', () => {
    component.hasTransactions = false;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__card-buttons__send-card'));
    expect(div).toBeNull();
  });

  it('should render performance card when hasTransactions is true', () => {
    component.hasTransactions = true;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__card-buttons__performance'));
    expect(div).not.toBeNull();
  });

  it('should not render performance card when hasTransactions is false', () => {
    component.hasTransactions = false;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__card-buttons__performance'));
    expect(div).toBeNull();
  });

  it('should render the message when hasTransactions is false', () => {
    component.hasTransactions = false;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__message'));
    expect(div).not.toBeNull();
  });

  it('should not render the message when hasTransactions is true', () => {
    component.hasTransactions = true;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsub__message'));
    expect(div).toBeNull();
  });

  it('should call trackEvent on trackService when Go to Send Button clicked', () => {
    component.hasTransactions = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Send');
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
    component.hasTransactions = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Performance');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Send page when Go to Send is clicked from HomeWalletPage', () => {
    component.hasTransactions = true;
    component.asset = '';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Send');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/send/select-currency']);
  });

  it('should navigate to Send page of an specific asset when Go to Send is clicked from AssetDetailPage', () => {
    component.hasTransactions = true;
    component.asset = 'USDT';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Send');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/send/detail/USDT']);
  });

  it('should navigate to buy page when Go to Buy is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Buy');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/fiat-ramps/operations');
  });

  it('should navigate to receive page with the default asset selected when Go to Receive is clicked from HomeWalletPage', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Receive');
    component.asset = '';
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/receive']);
  });

  it('should navigate to receive page with an asset selected when Go to Receive is clicked from AssetDetailPage', () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Receive');
    component.asset = 'LINK';
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
      ['wallets/receive'],
      Object({ queryParams: Object({ asset: 'LINK' }) })
    );
  });
});
