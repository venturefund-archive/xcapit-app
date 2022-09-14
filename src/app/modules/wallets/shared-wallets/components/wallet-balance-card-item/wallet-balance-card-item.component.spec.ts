import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';
import { By } from '@angular/platform-browser';
import { FormattedNetworkPipe } from '../../../../../shared/pipes/formatted-network-name/formatted-network.pipe';
import { TokenDetail } from '../../models/token-detail/token-detail';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { of } from 'rxjs';
import { rawMATICData } from '../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('WalletBalanceCardItemComponent', () => {
  let component: WalletBalanceCardItemComponent;
  let fixture: ComponentFixture<WalletBalanceCardItemComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(waitForAsync(() => {
    localStorageServiceSpy = jasmine.createSpyObj(
      'LocalStorageService',
      {
        toggleHideFunds: undefined,
      },
      { hideFunds: of(false) }
    );
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      {},
      {
        price: 20,
        balance: 1,
        quoteSymbol: 'USD',
        token: rawMATICData,
      }
    );
    TestBed.configureTestingModule({
      declarations: [WalletBalanceCardItemComponent, FormattedNetworkPipe, FormattedAmountPipe, HideTextPipe],
      imports: [IonicModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletBalanceCardItemComponent);
    component = fixture.componentInstance;
    component.tokenDetail = tokenDetailSpy;
    fixture.detectChanges();
  }));

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
    expect(labelList[1].nativeElement.innerHTML).toContain('1');
    expect(labelList[3].nativeElement.innerHTML).toContain('20 USD');
    expect(fixture.debugElement.query(By.css('ion-badge')).nativeElement.innerHTML).toContain('POLYGON');
  });
});
