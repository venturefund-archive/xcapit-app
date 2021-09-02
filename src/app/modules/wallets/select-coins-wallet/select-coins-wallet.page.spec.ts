import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { SelectCoinsWalletPage } from './select-coins-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

const testCoins = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    rpc: 'http://testrpc.test/',
  },
];

const formData = {
  valid: {
    ETH: true,
    RBTC: false,
  },
  invalid: {
    ETH: false,
    RBTC: false,
  },
};
describe('SelectCoinsWalletPage', () => {
  let component: SelectCoinsWalletPage;
  let fixture: ComponentFixture<SelectCoinsWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectCoinsWalletPage>;
  let navController: NavController;
  let walletService: WalletService;
  let walletServiceMock;

  beforeEach(
    waitForAsync(() => {
      walletServiceMock = {
        coins: [],
      };
      TestBed.configureTestingModule({
        declarations: [SelectCoinsWalletPage, TrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerMock },
          { provide: WalletService, useValue: walletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoinsWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    navController = TestBed.inject(NavController);
    walletService = TestBed.inject(WalletService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should almostOneChecked be true when execute method validate() and valid form', () => {
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.validate();
    expect(component.almostOneChecked).toBe(true);
  });

  it('should almostOneChecked be false when execute method validate() and invalid form', () => {
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.validate();
    expect(component.almostOneChecked).toBe(false);
  });

  it('should navigate to recovery phrase page on submit button clicked and valid form', () => {
    const spy = spyOn(navController, 'navigateForward');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.validate();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledWith(['/wallets/create-first/recovery-phrase']);
  });

  it('should not navigate to recovery phrase page on submit button clicked and invalid form', () => {
    const spy = spyOn(navController, 'navigateForward');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.validate();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should set coins in wallet service on handleSubmit and valid form', () => {
    spyOn(navController, 'navigateForward');
    component.coins = testCoins;
    component.form.patchValue({ ETH: true, RBTC: false });
    fixture.detectChanges();
    component.validate();
    component.handleSubmit();
    expect(walletService.coins).toEqual(testCoins);
  });
});
