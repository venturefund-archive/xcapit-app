import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProviderNewOperationCardComponent } from './provider-new-operation-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';

fdescribe('ProviderNewOperationCardComponent', () => {
  let component: ProviderNewOperationCardComponent;
  let fixture: ComponentFixture<ProviderNewOperationCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: UntypedFormGroup;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(
    waitForAsync(() => {
      coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });

      controlContainerMock = new UntypedFormBuilder().group({
        country: ['', []],
        provider: ['', []],
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      TestBed.configureTestingModule({
        declarations: [ProviderNewOperationCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ProviderNewOperationCardComponent);
      component = fixture.componentInstance;

      component.provider = rawProvidersData[0];
      component.coin = coinSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeCurrency event when currency selector is clicked', () => {
    const spy = spyOn(component.changeCurrency, 'emit');
    fixture.debugElement.query(By.css('app-coin-selector')).triggerEventHandler('changeCurrency', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
