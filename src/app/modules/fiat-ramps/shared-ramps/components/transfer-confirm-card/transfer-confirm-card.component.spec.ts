import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TransferConfirmCardComponent } from './transfer-confirm-card.component';
import { OperationDataInterface } from '../../services/operation/storage-operation.service';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedNetworkPipe } from '../../../../../shared/pipes/formatted-network-name/formatted-network.pipe'



const operationData : OperationDataInterface = {
  amount_in: '500',
  amount_out: '2.433208428633997',
  country: 'Argentina',
  currency_in: 'ARS',
  currency_out: 'USDC',
  network: 'MATIC',
  pair: 'ARS_USDC',
  price_in: '205.49',
  price_out: '1',
  provider: '1',
  type: 'cash-in',
  wallet: '0x4eCbFb306585A7f981cF0Fe298162EDce4D11699'
}
const provider: string = '2PI'

const nativeToken = {
  chainId: 42,
  id: 1,
  last: false,
  logoRoute: "assets/img/coins/ETH.svg",
  moonpayCode: "keth",
  name: "ETH - Ethereum",
  native: true,
  network: "ERC20",
  rpc: "https://eth-kovan.alchemyapi.io/v2/tfmomSigQreoKgOjz0W9W-j5SdtKkiZN",
  symbol: "ETHUSDT",
  value: "ETH"
};

fdescribe('TransferConfirmCardComponent', () => {
  let component: TransferConfirmCardComponent;
  let fixture: ComponentFixture<TransferConfirmCardComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(waitForAsync(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getNativeTokenFromNetwork: nativeToken,
    });
    TestBed.configureTestingModule({
      declarations: [TransferConfirmCardComponent, FormattedNetworkPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ApiWalletService, useValue: apiWalletServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferConfirmCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    component.operationData = operationData;
    component.token = nativeToken;
    component.provider = provider
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    
    const nameAndIconEl = fixture.debugElement.query(By.css('.tcc__card__operation'));
    expect(nameAndIconEl.nativeElement.innerHTML).toContain('ETH - Ethereum');
    // expect(nameAndIconEl.nativeElement.innerHTML).toContain(operationData.wallet);
  }) 
});
