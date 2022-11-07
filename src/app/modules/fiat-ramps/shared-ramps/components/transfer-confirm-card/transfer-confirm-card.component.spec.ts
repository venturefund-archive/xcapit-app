import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TransferConfirmCardComponent } from './transfer-confirm-card.component';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedNetworkPipe } from '../../../../../shared/pipes/formatted-network-name/formatted-network.pipe';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { OperationStatusChipComponent } from '../operation-status-chip/operation-status-chip.component';
import { OperationDataInterface } from '../../interfaces/operation-data.interface';

const provider: any = {
  name: '2PI',
};

describe('TransferConfirmCardComponent', () => {
  let component: TransferConfirmCardComponent;
  let fixture: ComponentFixture<TransferConfirmCardComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let tokenSpy: jasmine.SpyObj<Coin>;
  let operationDataSpy: jasmine.SpyObj<OperationDataInterface>;

  beforeEach(waitForAsync(() => {
    operationDataSpy = jasmine.createSpyObj(
      'OperationData',
      {},
      { wallet: '0x4eCbFb306585A7f981cF0Fe298162EDce4D11699', network: 'POLYGON' }
    );
    tokenSpy = jasmine.createSpyObj('Token', {}, { name: 'ETH - Ethereum', logoRoute: 'assets/img/coins/ETH.svg' });
    TestBed.configureTestingModule({
      declarations: [TransferConfirmCardComponent, FormattedNetworkPipe, OperationStatusChipComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ApiWalletService, useValue: apiWalletServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferConfirmCardComponent);
    component = fixture.componentInstance;
    component.provider = provider;
    component.operationData = operationDataSpy;
    component.token = tokenSpy;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const tokenIconEl = fixture.debugElement.query(By.css('img.tcc__card__icon'));
    const tokenNameEl = fixture.debugElement.query(By.css('.tcc__card__name-and-icon__name'));
    const operationDataWalletEl = fixture.debugElement.query(By.css('.tcc__card__address-dst__content ion-text'));
    const operationDataNetworkEl = fixture.debugElement.query(By.css('.tcc__card_network__content ion-text'));
    const providerNameEl = fixture.debugElement.query(By.css('.tcc__card__provider__content ion-text'));

    expect(tokenIconEl.attributes.src).toEqual('assets/img/coins/ETH.svg');
    expect(tokenNameEl.nativeElement.innerHTML).toContain('ETH - Ethereum');
    expect(operationDataWalletEl.nativeElement.innerHTML).toContain('0x4eCbFb306585A7f981cF0Fe298162EDce4D11699');
    expect(operationDataNetworkEl.nativeElement.innerHTML).toContain('POLYGON');
    expect(providerNameEl.nativeElement.innerHTML).toContain('2PI');
  });
});
