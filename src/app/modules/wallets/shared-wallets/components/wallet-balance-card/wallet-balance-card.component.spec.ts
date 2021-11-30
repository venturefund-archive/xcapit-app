import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { WalletBalanceCardComponent } from './wallet-balance-card.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

describe('WalletBalanceCardComponent', () => {
  let component: WalletBalanceCardComponent;
  let fixture: ComponentFixture<WalletBalanceCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletBalanceCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardComponent, FakeTrackClickDirective],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardComponent);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallet-balance-card-item when have balances', () => {
    component.balances = balances;
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-balance-card-item'));
    expect(cardItemElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card-item when not have balances', () => {
    component.balances = [];
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-balance-card-item'));
    expect(cardItemElement).toBeNull();
  });

  it('should redirect to Select Coins Page in edit mode when Edit Tokens clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Edit Tokens"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/select-coins', 'edit']);
  });

  it('should call appTrackEvent on trackService when Edit Tokens clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Tokens');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
