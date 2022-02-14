import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { ethers } from 'ethers';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { LiquidityRequestComponent } from './liquidity-request.component';

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
      data: "0xf305d71900000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000dcef33a6f8380000000000000000000000000000000000000000000000000000001320c43eb8fa40000000000000000000000009c7314d0745bf0df80040dabd6ce87efcc5969e8000000000000000000000000000000000000000000000000000000006205962e",
      from: "0x9c7314d0745bf0df80040dabd6ce87efcc5969e8",
      gas: "0x31daf",
      gasPrice: "0x3e252e0",
      to: "0xf55c496bb1058690db1401c4b9c19f3f44374961",
      value: "0x13395f9a5fdb6"
    }
  ]
}

const providerSymbol = 'trBTC';

const decodedData = {
  action: "add_liquidity",
  amount0: "amountTokenDesired",
  hasValue: true,
  liquidity: false,
  name: "addLiquidityETH",
  type: "liquidity",
  useNative: true,
  data: [
    {name: 'token', value: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe', type: 'address'},
    {name: 'amountTokenDesired', value: '1000000000000000000', type: 'uint256'},
    {name: 'amountTokenMin', value: '995000000000000000', type: 'uint256'},
    {name: 'amountETHMin', value: '336503237218212', type: 'uint256'},
    {name: 'to', value: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8', type: 'address'},
    {name: 'deadline', value: '1644533294', type: 'uint256'}
  ]
}

const decodedDataNoNative = {
  action: "add_liquidity",
  amount0: 'amountADesired',
  amount1: 'amountBDesired',
  hasValue: false,
  liquidity: false,
  name: "addLiquidity",
  type: "liquidity",
  useNative: false,
  data: [
    {name: 'tokenA', value: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe', type: 'address'},
    {name: 'tokenB', value: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe', type: 'address'},
    {name: 'amountADesired', value: '2100000000000000000', type: 'uint256'},
    {name: 'amountBDesired', value: '3400000000000000000', type: 'uint256'},
    {name: 'liquidity', value: '27500000000000000000', type: 'uint256'},
    {name: 'to', value: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8', type: 'address'},
    {name: 'deadline', value: '1644533294', type: 'uint256'}
  ]
}

describe('LiquidityRequestComponent', () => {
  let component: LiquidityRequestComponent;
  let fixture: ComponentFixture<LiquidityRequestComponent>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;

  beforeEach(waitForAsync(() => {
    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
      getTokenSymbol: Promise.resolve({}),
      getPairTokens: Promise.resolve({}),
      providerSymbol: 'trBTC'
    });
    TestBed.configureTestingModule({
      declarations: [ LiquidityRequestComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot() ],
      providers: [
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidityRequestComponent);
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

  it('should use value from request when parseInfo is called and decodedData hasValue is true', () => {
    walletConnectServiceSpy.providerSymbol = 'trBTC';
    component.symbols = ['trBTC', 'tRIF'];
    const data = Object.assign(decodedData);
    data.hasValue = true;
    component.decodedData = data;
    fixture.detectChanges();
    component.parseInfo();
    expect(component.amountToken0).toEqual('0.00033819420825951');
    expect(component.amountToken1).toEqual('1.0');
  });

  it('should set tokens amount inverted when symbols are inverted', () => {
    walletConnectServiceSpy.providerSymbol = 'trBTC';
    component.symbols = ['tRIF', 'trBTC'];
    const data = Object.assign(decodedData);
    data.hasValue = true;
    component.decodedData = data;
    fixture.detectChanges();
    component.parseInfo();
    expect(component.amountToken0).toEqual('1.0');
    expect(component.amountToken1).toEqual('0.00033819420825951');
  });

  it('should call walletConnectService getTokenSymbol twice when decodedData does not use a native token', async () => {
    component.decodedData = decodedDataNoNative;
    fixture.detectChanges();
    await component.setTokensSymbols();
    fixture.whenStable();
    expect(walletConnectServiceSpy.getTokenSymbol).toHaveBeenCalledTimes(2);
  });

  it('should set tokens amount from decodedData when hasValue is false', () => {
    component.decodedData = decodedDataNoNative;
    fixture.detectChanges();
    component.parseInfo();
    expect(component.amountToken0).toEqual('2.1');
    expect(component.amountToken1).toEqual('3.4');
  });

  it('should set liquidity provided value when decodedData liquidity is true', () => {
    const data = Object.assign(decodedDataNoNative);
    data.liquidity = true;
    component.decodedData = data;
    fixture.detectChanges();
    component.parseInfo();
    fixture.whenStable();
    expect(component.liquidity).toEqual('27.5');
  });

  it('should set amount token information in the same order than symbols ["trBTC", "tRIF"]', () => {
    walletConnectServiceSpy.providerSymbol = 'trBTC';
    component.symbols = ['trBTC', 'tRIF'];
    const data = Object.assign(decodedDataNoNative);
    data.amount1 = 'amountETHMin';
    data.amount0 = 'amountTokenMin';
    component.decodedData = data;
    fixture.detectChanges();
    component.setAmountsInfo();
    expect(component.amountToken0Min).toBeTruthy()
    expect(component.amountToken1Min).toBeTruthy()
  });

  it('should set amount token information in the same order than symbols ["tRIF", "trBTC"]', () => {
    walletConnectServiceSpy.providerSymbol = 'trBTC';
    component.symbols = ['tRIF', 'trBTC'];
    const data = Object.assign(decodedDataNoNative);
    data.amount1 = 'amountETHMin';
    data.amount0 = 'amountTokenMin';
    component.decodedData = data;
    fixture.detectChanges();
    component.setAmountsInfo();
    expect(component.amountToken0Min).toBeTruthy()
    expect(component.amountToken1Min).toBeTruthy()
  });
});
