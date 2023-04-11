import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ProviderCardComponent } from './provider-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeProviders } from 'src/app/modules/fiat-ramps/shared-ramps/models/providers/fake/fake-providers';
import { rawProvidersData } from 'src/app/modules/fiat-ramps/shared-ramps/fixtures/raw-providers-data';
import { of } from 'rxjs';
import { ProvidersFactory } from 'src/app/modules/fiat-ramps/shared-ramps/models/providers/factory/providers.factory';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ProviderCardComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeProviders: FakeProviders;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let kriptonProvider: any;
  let directa24Provider: any;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    kriptonProvider = {
      id: 2,
      alias: 'kripton',
      name: 'Kripton Market',
      logoRoute: 'assets/test_image.svg',
      description: 'fiat_ramps.select_provider.description',
      newOperationRoute: '/fiat-ramps/new-operation/kripton',
      countries: ['Argentina', 'Venezuela', 'Uruguay', 'Peru', 'Colombia'],
      trackClickEventName: 'ux_buy_kripton',
      providerName: 'kripton',
    };
    directa24Provider = {
      id: 5,
      alias: 'PX',
      quote: 1,
      name: 'Pichincha',
      logoRoute: 'assets/test_image.svg',
      description: 'fiat_ramps.select_provider.description',
      newOperationRoute: '/fiat-ramps/new-operation/pichincha',
      countries: ['Argentina', 'Venezuela', 'Uruguay', 'Peru', 'Colombia'],
      trackClickEventName: 'ux_test',
      providerName: 'directa24',
    };
    fakeProviders = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'PX'),
      null,
      of([
        {
          code: 'PX',
          paymentType: 'VOUCHER',
        },
      ])
    );
    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: fakeProviders,
    });
    TestBed.configureTestingModule({
      declarations: [ProviderCardComponent, FakeTrackClickDirective, FormattedAmountPipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    component.provider = kriptonProvider;
    component.txMode = 'buy';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.provider = { quote: 1, ...kriptonProvider };
    fixture.detectChanges();
    await component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const imgEl = fixture.debugElement.query(By.css('div.pcc__content__image'));
    const paymentTypeEl = fixture.debugElement.query(By.css('.pcc__content__body__name > ion-text'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.description'));
    expect(imgEl.nativeElement.innerHTML).toBeTruthy();
    expect(paymentTypeEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.constants.payment_types.kripton');
    expect(descriptionEl.nativeElement.innerHTML).toContain(kriptonProvider.description);
  });

  it('should render properly directa24 provider', fakeAsync(() => {
    component.provider = directa24Provider;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('div.pcc__content__image'));
    const paymentTypeEl = fixture.debugElement.query(By.css('ion-text.paymentType'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.description'));
    expect(imgEl.nativeElement.innerHTML).toBeTruthy();
    expect(paymentTypeEl.nativeElement.innerHTML).toContain(
      'fiat_ramps.shared.constants.payment_types.directa24_voucher'
    );
    expect(descriptionEl.nativeElement.innerHTML).toContain(directa24Provider.description);
  }));

  it('should show skeleton when quote is not loaded yet', () => {
    const skeletonEl = fixture.debugElement.query(By.css('div.pcc__content__body__description ion-skeleton-text'));
    fixture.detectChanges();
    expect(skeletonEl).toBeTruthy();
  });

  it('should show best quote badge when provider have best quote', () => {
    component.provider = { isBestQuote: true, ...kriptonProvider };
    fixture.detectChanges();
    const besQuoteBadgeEl = fixture.debugElement.query(By.css('.pcc ion-badge'));
    expect(besQuoteBadgeEl).toBeTruthy();
  });

  it('should emit event when radio button is checked', () => {
    component.disabled = true;
    const spy = spyOn(component.selectedProvider, 'emit');
    fixture.debugElement.query(By.css('ion-radio')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_buy_moonpay Radio clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-radio', 'ux_buy_moonpay');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when informative_modal clicked', () => {
    component.provider.showInfo = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'informative_modal');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal of kripton sell when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Kripton';
    component.provider.providerName = 'kripton';
    component.txMode = 'sell'
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal of bitrefill sell when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Bitrefill';
    component.provider.providerName = 'bitrefill';
    component.txMode = 'sell'
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  

  

  it('should show informative modal of Moonpay provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Moonpay';
    component.provider.providerName = 'moonpay';
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal of Kripton provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.isInfoModalOpen = false;
    component.provider.name = 'Kripton Market';
    component.provider.providerName = 'kripton';
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show generic informative modal of provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Directa 24';
    component.provider.providerName = 'directa24';
    component.provider.alias = 'PX';
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show informative information_modal clicked when modal is opened', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Moonpay';
    component.provider.providerName = 'moonpay';
    component.isInfoModalOpen = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should render properly directa24 provider', fakeAsync(() => {
    component.provider = directa24Provider;
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('div.pcc__content__image'));
    const paymentTypeEl = fixture.debugElement.query(By.css('ion-text.paymentType'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.description'));
    expect(imgEl.nativeElement.innerHTML).toBeTruthy();
    expect(paymentTypeEl.nativeElement.innerHTML).toContain(
      'fiat_ramps.shared.constants.payment_types.directa24_voucher'
    );
    expect(descriptionEl.nativeElement.innerHTML).toContain(directa24Provider.description);
  }));
});
