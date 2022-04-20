import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectProviderCardComponent } from './select-provider-card.component';

const providersTest = [
  {
    id: 1,
    alias: 'moonpay',
    name: 'Moonpay',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/moonpay',
    countries: ['Argentina', 'Colombia'],
    showProvider: false,
  },
  {
    id: 2,
    alias: 'kripton',
    name: 'Kripton Market',
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    newOperationRoute: '/fiat-ramps/new-operation',
    countries: ['Argentina', 'Venezuela'],
    showProvider: false,
  },
];

describe('SelectProviderCardComponent', () => {
  let component: SelectProviderCardComponent;
  let fixture: ComponentFixture<SelectProviderCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectProviderCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderCardComponent);
      component = fixture.componentInstance;
      component.providers = providersTest;
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

  it('should emit event when country is changed', () => {
    const spy = spyOn(component.onChange, 'emit');
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', { value: 'Argentina' });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set disable in false when no country is selected', () => {
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', '');
    fixture.detectChanges();
    expect(component.disabled).toBeFalsy();
  });

  it('should set disable in true when country is selected and show providers', () => {
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', { value: 'Argentina' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    expect(providerCard).toBeTruthy();
    expect(component.disabled).toEqual(true);
  });

  it('should show correct providers for Argentina', () => {
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', { value: 'Argentina' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      let show = provider.countries.includes('Argentina');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(true);
    expect(providersTest[1].showProvider).toEqual(true);
  });

  it('should show correct providers for Colombia', () => {
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', { value: 'Colombia' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      let show = provider.countries.includes('Colombia');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(true);
    expect(providersTest[1].showProvider).toEqual(false);
  });

  it('should show correct providers for Venezuela', () => {
    fixture.debugElement.query(By.css('app-input-select')).triggerEventHandler('selectedItem', { value: 'Venezuela' });
    const providerCard = fixture.debugElement.query(By.css('app-provider-card'));
    fixture.detectChanges();
    for (let provider of providersTest) {
      let show = provider.countries.includes('Venezuela');
      provider = Object.assign(provider, { showProvider: show });
    }
    expect(providerCard).toBeTruthy();
    expect(providersTest[0].showProvider).toEqual(false);
    expect(providersTest[1].showProvider).toEqual(true);
  });
});
