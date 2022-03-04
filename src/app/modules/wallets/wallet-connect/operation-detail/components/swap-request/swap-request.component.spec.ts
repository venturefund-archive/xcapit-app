import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { ethers } from 'ethers';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { SwapRequestComponent } from './swap-request.component';

const dateInfo = {
  date: moment().utc().format('DD/MM/YYYY'),
  time: moment().utc().format('HH:mm'),
}

const request = {
  id: 1644526121229049,
  jsonrpc: "2.0",
  method: "eth_sendTransaction",
  params: [
    {
      data: "0x18cbafe50000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000001c53f6530922100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000009c7314d0745bf0df80040dabd6ce87efcc5969e80000000000000000000000000000000000000000000000000000000062057ed8000000000000000000000000000000000000000000000000000000000000000300000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe000000000000000000000000cb46c0ddc60d18efeb0e586c17af6ea36452dae000000000000000000000000009b6ca5e4496238a1f176aea6bb607db96c2286e",
      from: "0x9c7314d0745bf0df80040dabd6ce87efcc5969e8",
      gas: "0x432b3",
      gasPrice: "0x3e252e0",
      to: "0xf55c496bb1058690db1401c4b9c19f3f44374961",
      value: '5000000000000000000'
    }
  ]
}

const providerSymbol = 'trBTC';

const decodedData = {
  action: "swap",
  hasValue: false,
  in: "amountIn",
  name: "swapExactTokensForETH",
  nativeOrder: 1,
  out: "amountOutMin",
  type: "swap",
  useNative: true,
  data: [
    {name: 'amountIn', value: '1000000000000000000', type: 'uint256'},
    {name: 'amountOutMin', value: '498351048004129', type: 'uint256'},
    {name: 'path', value: ["0x19f64674d8a5b4e652319f5e239efd3bc969a1fe", "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", "0x09b6ca5e4496238a1f176aea6bb607db96c2286e"], type: 'address[]'},
    {name: 'to', value: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8', type: 'address'},
    {name: 'deadline', value: '1644527320', type: 'uint256'}
  ]
}

describe('SwapRequestComponent', () => {
  let component: SwapRequestComponent;
  let fixture: ComponentFixture<SwapRequestComponent>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;

  beforeEach(waitForAsync(() => {
    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
      getTokenSymbol: Promise.resolve({}),
    });

    TestBed.configureTestingModule({
      declarations: [ SwapRequestComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: WalletConnectService, useValue: walletConnectServiceSpy},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SwapRequestComponent);
    component = fixture.componentInstance;
    component.dateInfo = dateInfo;
    component.request = request;
    component.decodedData = decodedData;
    component. providerSymbol = providerSymbol;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setTokensSymbols when on ngOnInit', () => {
    const spy = spyOn(component, 'setTokensSymbols');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call parseInfo and setAmountInfo when setTokensSymbols is called', async () => {
    const parseSpy = spyOn(component, 'parseInfo');
    const amountSpy = spyOn(component, 'setAmountsInfo');
    await component.setTokensSymbols();
    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(amountSpy).toHaveBeenCalledTimes(1);
  });

  it('should call walletConnectService getTokenSymbol twice when decodedData does not use a native token', () => {
    decodedData.useNative = false;
    component.decodedData = decodedData;
    fixture.detectChanges();
    component.setTokensSymbols();
    expect(walletConnectServiceSpy.getTokenSymbol).toHaveBeenCalledTimes(2);
  });

  it('should use value from request when parseInfo is called and decodedData hasValue is true', () => {
    decodedData.hasValue = true;
    component.decodedData = decodedData;
    fixture.detectChanges();
    component.parseInfo();
    expect(component.amountIn).toEqual('5.0');
    expect(component.amountOut).toEqual('0.000498351048004129');
  });
});
