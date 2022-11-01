import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FakeProviders } from '../shared-ramps/models/providers/fake/fake-providers';

import { KriptonOperationDetailPage } from './kripton-operation-detail.page';

fdescribe('KriptonOperationDetailPage', () => {
  let component: KriptonOperationDetailPage;
  let fixture: ComponentFixture<KriptonOperationDetailPage>;
  let fakeRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let fakeProviders: FakeProviders;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  const operation: FiatRampOperation = {
    operation_id: 678,
    operation_type: 'cash-in',
    status: 'cancel',
    currency_in: 'ARS',
    amount_in: 500.0,
    currency_out: 'USDT',
    amount_out: 100.0,
    created_at: new Date('2021-02-27T10:02:49.719Z'),
    provider: '1',
    voucher: false,
  };
  
  const mappedOperation: OperationDataInterface = {
    type: operation.operation_type,
    amount_in: operation.amount_in.toString(),
    amount_out: operation.amount_out.toString(),
    currency_in: operation.currency_in,
    currency_out: operation.currency_out,
    price_in: '1',
    price_out: '5',
    wallet: operation.wallet_address,
    provider: operation.provider,
    voucher: operation.voucher,
    operation_id: operation.operation_id,
    network: 'ERC20',
  };

  beforeEach(waitForAsync(() => {
    fakeRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeRoute.createSpy();
    fakeProviders = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'kripton'),
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

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [KriptonOperationDetailPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonOperationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show selected provider on init', () => {
    const spy = spyOn(FakeProviders.prototype, 'byAlias');
    component.ionViewWillEnter();

    expect(spy).toHaveBeenCalledOnceWith('kripton');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should show operation details on init', () => {
    const title = fixture.debugElement.query(By.css('ion-text[name="Coin"]')).nativeElement.innerText;
    const amount = fixture.debugElement.query(By.css('ion-text[name="Amount"]')).nativeElement.innerText;
    const fiatAmount = fixture.debugElement.query(By.css('ion-text[name="Fiat Amount"]')).nativeElement.innerText;
    const state = fixture.debugElement.query(By.css('app-operation-status-chip'));
    const toast = fixture.debugElement.query(By.css('app-kripton-bo-state-toast'));
    const quotations = fixture.debugElement.query(By.css('ion-text[name="Quotations"]')).nativeElement.innerText;
    const address = fixture.debugElement.query(By.css('ion-text[name="Address"]')).nativeElement.innerText;
    const operationNumber = fixture.debugElement.query(By.css('ion-text[name="Operation Number"]')).nativeElement.innerText;
    const provider = fixture.debugElement.query(By.css('ion-text[name="Pr"]')).nativeElement.innerText;
    const providerIcon = fixture.debugElement.query(By.css('ion-text[name=""]')).nativeElement;
    const date = fixture.debugElement.query(By.css('ion-text[name=""]')).nativeElement.innerText;
    const hour = fixture.debugElement.query(By.css('ion-text[name=""]')).nativeElement.innerText;
    expect(title).toContain(operation.currency_out);
    expect(amount).toContain(operation.amount_out);
    expect(fiatAmount).toContain(operation.amount_in);
    expect(state).toBeTruthy();
    expect(toast).toBeTruthy();
    expect(quotations).toContain("1 USDT = 5 ARS");
    expect(address).toContain(operation.wallet_address);
    expect(operationNumber).toContain(operation.operation_id);
    expect(provider).toContain("Kripton");
    expect(providerIcon.attributes.src).toContain("assets/img/provider-logos/KriptonMarket.svg");
    expect(date).toContain("27/02/2021");
    expect(hour).toContain("10:02");
  });

  it('should redirect to Kripton Support when user clicks UNDEFINED_BUTTON button', () => {
    const url = {
      url: 'https://kriptonmarket.com/support-link',
    };
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="undefined"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith(url);
  });

  it('should show toast with information about the operation status', () => {

  });
});
