import { TestBed } from '@angular/core/testing';
import { Signer } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { DefaultERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { FormattedFee } from '../../shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { WithdrawConfirmationController } from './withdraw-confirmation.controller';

describe('WithdrawConfirmationController', () => {
  let service: WithdrawConfirmationController;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let signerSpy: jasmine.SpyObj<Signer>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', { contractAddress: '0x000001', token: {} });
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'USDC' });
    signerSpy = jasmine.createSpyObj('Signer', { getAddress: Promise.resolve('0x000001') });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getNetworks: [] });
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    service = TestBed.inject(WithdrawConfirmationController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create Dynamic price', () => {
    expect(service.createDynamicPrice(10, coinSpy, apiWalletServiceSpy)).toBeInstanceOf(DynamicPrice);
  });

  it('should create Gas Fee Of', () => {
    expect(
      service.createGasFeeOf(jasmine.createSpyObj('Contract', { balanceOf: Promise.resolve(3) }), 'balanceOf', [])
    ).toBeInstanceOf(GasFeeOf);
  });

  it('should create Withdraw Fee Contract ', async () => {
    expect(
      await service.withdrawFeeContract(
        investmentProductSpy,
        jasmine.createSpyObj('Erc20Provider', { value: {} }),
        signerSpy
      )
    ).toBeInstanceOf(TwoPiContract);
  });

  it('should create ERC20 Provider', () => {
    expect(service.createErc20Provider(coinSpy)).toBeInstanceOf(DefaultERC20Provider);
  });

  it('should create Investment', () => {
    expect(service.investment(investmentProductSpy, signerSpy, apiWalletServiceSpy)).toBeInstanceOf(TwoPiInvestment);
  });

  it('should create Formatted Fee', () => {
    expect(service.createFormattedFee(jasmine.createSpyObj('Fee', { value: Promise.resolve(8) }))).toBeInstanceOf(
      FormattedFee
    );
  });
});
