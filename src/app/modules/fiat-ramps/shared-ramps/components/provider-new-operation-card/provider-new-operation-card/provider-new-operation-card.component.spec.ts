import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProviderNewOperationCardComponent } from './provider-new-operation-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { PROVIDERS } from '../../../constants/providers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';

describe('ProviderNewOperationCardComponent', () => {
  let component: ProviderNewOperationCardComponent;
  let fixture: ComponentFixture<ProviderNewOperationCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: FormGroup;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(
    waitForAsync(() => {
      coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });

      controlContainerMock = new FormBuilder().group({
        country: ['', []],
        provider: ['', []],
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      TestBed.configureTestingModule({
        declarations: [ProviderNewOperationCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      }).compileComponents();

      fixture = TestBed.createComponent(ProviderNewOperationCardComponent);
      component = fixture.componentInstance;

      component.provider = PROVIDERS.find((provider) => provider.alias === 'kripton');
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
