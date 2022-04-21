import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
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
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: FormGroup;

  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new FormBuilder().group({
        country: ['', []],
        provider: ['', []],
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;
      TestBed.configureTestingModule({
        declarations: [SelectProviderCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
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
