import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';
import { AssetBalanceModel } from '../../models/asset-balance/asset-balance.class';
import { By } from '@angular/platform-browser';

const testBalances: any = {
  icon: 'assets/img/coins/ETH.svg',
  symbol: 'ETH',
  name: 'Ethereum',
  amount: 1,
  price: 3000,
  quoteSymbol: 'USD',
};

describe('WalletBalanceCardItemComponent', () => {
  let component: WalletBalanceCardItemComponent;
  let fixture: ComponentFixture<WalletBalanceCardItemComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardItemComponent],
        imports: [IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardItemComponent);
      component = fixture.componentInstance;
      component.balance = jasmine.createSpyObj('AssetBalanceModel', {}, testBalances);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to asset detail when item is clicked', () => {
    fixture.debugElement.query(By.css('div.wbci')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/asset-detail/', 'ETH']);
  });

  it('should render balance item properly', () => {
    const imgEl = fixture.debugElement.query(By.css('img.wbci__img'));
    const labelList = fixture.debugElement.queryAll(By.css('ion-label'));

    expect(imgEl.attributes.src).toContain('assets/img/coins/ETH.svg');
    expect(labelList[0].nativeElement.innerHTML).toContain('ETH');
    expect(labelList[1].nativeElement.innerHTML).toContain('1.00 ETH');
    expect(labelList[2].nativeElement.innerHTML).toContain('Ethereum');
    expect(labelList[3].nativeElement.innerHTML).toContain('3,000.00 USD');
  });
});
