import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FiatRampsService } from '../../../shared-ramps/services/fiat-ramps.service';
import { SelectProviderCardComponent } from './select-provider-card.component';

const providersTest = [
  {
    id: 1,
    alias: 'moonpay',
    name: 'Moonpay',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/moonpay',
    countries: ['Argentina', 'Colombia'],
    showProvider: false,
    trackClickEventName: 'ux_buy_moonpay',
  },
  {
    id: 2,
    alias: 'kripton',
    name: 'Kripton Market',
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    newOperationRoute: '/fiat-ramps/new-operation/kripton',
    countries: ['Argentina', 'Venezuela'],
    showProvider: false,
    trackClickEventName: 'ux_buy_kripton',
  },
];

const directaProviders = [
  {
    code: 'UU',
    name: 'Ualá',
    logo: 'logoUala',
    paymentType: 'VOUCHER',
  },
  {
    code: 'LN',
    name: 'Banco Nacion',
    logo: 'logoBanco',
    paymentType: 'BANK_TRANSFER',
  },
];

const localDirectaProviders = [
  {
    alias: 'PF',
    name: 'Pagofacil',
    logoRoute: 'pagofacil_logo',
    description: 'pagofacil_description',
    newOperationRoute: '/',
    trackClickEventName: 'ux_buy_pagofacil',
    countries: ['Argentina'],
  },
  {
    alias: 'UU',
    name: 'UALA',
    logoRoute: 'uala_logo',
    description: 'uala_description',
    newOperationRoute: '/',
    trackClickEventName: 'ux_buy_uala',
    countries: ['Argentina'],
  },
];
describe('SelectProviderCardComponent', () => {
  let component: SelectProviderCardComponent;
  let fixture: ComponentFixture<SelectProviderCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: FormGroup;
  let fiatRampsServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new FormBuilder().group({
        country: ['', []],
        provider: ['', []],
      });

      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getDirectaProviders: of(directaProviders),
      });
      TestBed.configureTestingModule({
        declarations: [SelectProviderCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderCardComponent);
      component = fixture.componentInstance;
      component.providers = providersTest;
      component.directaProviders = localDirectaProviders;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when radio button is checked', () => {
    component.disabled = true;
    const spy = spyOn(component.route, 'emit');
    fixture.debugElement.query(By.css('app-provider-card')).triggerEventHandler('selectedProvider', 'test');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set disable in false when no country is selected', () => {
    component.form.patchValue({ country: '' });
    fixture.detectChanges();
    expect(component.disabled).toBeFalsy();
  });

  it('should set disable in true when country is selected and show providers', () => {
    component.form.patchValue({ country: 'Argentina' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    expect(providerCard).toBeTruthy();
    expect(component.disabled).toEqual(true);
  });

  it('should show correct providers for Argentina', () => {
    component.form.patchValue({ country: 'Argentina' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      const show = provider.countries.includes('Argentina');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(true);
    expect(providersTest[1].showProvider).toEqual(true);
  });

  it('should show correct directa24 providers for Argentina', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: { name: 'Argentina', directaCode: 'AR' } });
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(),fixture.whenRenderingDone()]);
    expect(component.availableDirectaProviders.length).toEqual(1);
  });

  it('should show correct providers for Colombia', () => {
    component.form.patchValue({ country: 'Colombia' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      const show = provider.countries.includes('Colombia');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(true);
    expect(providersTest[1].showProvider).toEqual(false);
  });

  it('should show correct providers for Venezuela', () => {
    component.form.patchValue({ country: 'Venezuela' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      const show = provider.countries.includes('Venezuela');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(false);
    expect(providersTest[1].showProvider).toEqual(true);
  });
});
