import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';
import { By } from '@angular/platform-browser';
import { FormattedNetworkPipe } from '../../pipes/formatted-network-name/formatted-network.pipe';
import { TokenDetail } from '../../models/token-detail/token-detail';
import { Coin } from '../../interfaces/coin.interface';

describe('WalletBalanceCardItemComponent', () => {
  let component: WalletBalanceCardItemComponent;
  let fixture: ComponentFixture<WalletBalanceCardItemComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      coinSpy = jasmine.createSpyObj(
        'Coin',
        {},
        { value: 'MATIC', logoRoute: 'assets/img/coins/MATIC.svg', network: 'MATIC' }
      );
      tokenDetailSpy = jasmine.createSpyObj(
        'TokenDetail',
        {},
        {
          price: 20,
          balance: 1,
          quoteSymbol: 'USD',
          coin: coinSpy,
        }
      );
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardItemComponent, FormattedNetworkPipe],
        imports: [IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardItemComponent);
      component = fixture.componentInstance;
      component.tokenDetail = tokenDetailSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to asset detail when item is clicked', () => {
    fixture.debugElement.query(By.css('div.wbci')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/asset-detail/', 'MATIC']);
  });

  it('should render balance item properly', () => {
    const imgEl = fixture.debugElement.query(By.css('img.wbci__img'));
    const labelList = fixture.debugElement.queryAll(By.css('ion-label'));

    expect(imgEl.attributes.src).toContain('assets/img/coins/MATIC.svg');
    expect(labelList[0].nativeElement.innerHTML).toContain('MATIC');
    expect(labelList[1].nativeElement.innerHTML).toContain('1.00 MATIC');
    expect(labelList[3].nativeElement.innerHTML).toContain('20.00 USD');
    expect(fixture.debugElement.query(By.css('ion-badge')).nativeElement.innerHTML).toContain('POLYGON');
  });
});
