import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';

import { AmountInputCardComponent } from './amount-input-card.component';
import { TEST_ERC20_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';

const testCoins = [
  {
    id: 0,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 1,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
];
describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new FormBuilder().group({
        amount: ['', []],
        quoteAmount: ['', []],
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 4000 } }),
        getCoins: testCoins,
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;
      TestBed.configureTestingModule({
        declarations: [AmountInputCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AmountInputCardComponent);
      component = fixture.componentInstance;
      component.baseCurrency = testCoins[0];
    })
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get the initial price and initialize the price subscription on init', fakeAsync(() => {
    fixture.detectChanges();
    tick(20000);
    expect(component.priceSubscription$).toBeTruthy();
    expect(apiWalletServiceSpy.getPrices).toHaveBeenCalledTimes(2);
    component.ngOnDestroy();
    flush();
  }));

  it('should calculate usd price when amount changes', fakeAsync(() => {
    fixture.detectChanges();
    component.form.patchValue({ amount: 20 });
    expect(component.form.value.quoteAmount).toEqual(80000);
    component.ngOnDestroy();
    flush();
  }));
});
