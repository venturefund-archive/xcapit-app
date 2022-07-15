import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProvidersFactory } from '../../../shared-ramps/models/providers/factory/providers.factory';
import { SelectProviderCardComponent } from './select-provider-card.component';
import { rawProvidersData } from '../../../shared-ramps/fixtures/raw-providers-data';
import { HttpClient } from '@angular/common/http';
import { Providers } from '../../../shared-ramps/models/providers/providers.interface';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';

describe('SelectProviderCardComponent', () => {
  let component: SelectProviderCardComponent;
  let fixture: ComponentFixture<SelectProviderCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: FormGroup;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new FormBuilder().group({
        country: ['', []],
        provider: ['', []],
      });

      providersSpy = jasmine.createSpyObj('Providers', {
        all: rawProvidersData,
        availablesBy: Promise.resolve(rawProvidersData.filter((provider) => provider.countries.includes('Ecuador'))),
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });

      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      TestBed.configureTestingModule({
        declarations: [SelectProviderCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: RemoteConfigService, useValue: remoteConfigSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderCardComponent);
      component = fixture.componentInstance;
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

  it('should show all disabled provider on init', () => {
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    expect(providerCards.length).toEqual(4);
    expect(component.disabled).toBeTrue();
    expect(component.form.value.country).toEqual('');
  });

  it('should filter providers by country and show them enabled', async () => {
    component.form.patchValue({ country: 'Ecuador' });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    expect(providerCards.length).toEqual(2);
    expect(component.disabled).toEqual(false);
  });
});
