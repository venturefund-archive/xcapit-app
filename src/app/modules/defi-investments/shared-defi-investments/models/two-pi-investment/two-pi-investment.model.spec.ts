import { TwoPiInvestment } from './two-pi-investment.model';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { BigNumber, Contract, Wallet } from 'ethers';
import { ERC20Token } from '../erc20-token/erc20-token.model';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TwoPiContract } from '../two-pi-contract/two-pi-contract.model';

const contractAddress = '0xCB50fF1863cBBAd718d3A1eEEf403a95C58d3B16';
const referralAddress = 'referralAddress';

describe('TwoPiInvestment', () => {
  let productSpy: jasmine.SpyObj<InvestmentProduct>;
  let wallet: Wallet;
  let erc20TokenSpy: jasmine.SpyObj<ERC20Token>;
  let erc20ProviderSpy: jasmine.SpyObj<ERC20Provider>;
  let twoPiContractSpy: jasmine.SpyObj<TwoPiContract>;
  let contractSpy: jasmine.SpyObj<Contract>;
  let twoPiInvestment: TwoPiInvestment;
  beforeEach(() => {
    contractSpy = jasmine.createSpyObj('Contract', { deposit: Promise.resolve({} as TransactionResponse) });
    productSpy = jasmine.createSpyObj('InvestmentProduct', { id: 1, token: { decimals: 6 }, contractAddress });
    wallet = Wallet.fromMnemonic(
      'clever brain critic belt soldier daring own luxury begin plate orange banana',
      "m/44'/80001'/0'/0/0"
    );
    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', { approve: Promise.resolve({} as TransactionResponse) });
    erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', { value: {} });
    twoPiContractSpy = jasmine.createSpyObj('TwoPiContract', { value: contractSpy });
    twoPiInvestment = new TwoPiInvestment(
      productSpy,
      wallet,
      erc20TokenSpy,
      erc20ProviderSpy,
      twoPiContractSpy,
      referralAddress
    );
  });

  it('should create', () => {
    expect(twoPiInvestment).toBeTruthy();
  });

  it('should create without token and provider', () => {
    expect(TwoPiInvestment.create(productSpy, wallet)).toBeTruthy();
  });

  it('should deposit', async () => {
    const wei = BigNumber.from('50000000');
    await twoPiInvestment.deposit(50);
    expect(erc20TokenSpy.approve).toHaveBeenCalledOnceWith(contractAddress, wei);
    expect(contractSpy.deposit).toHaveBeenCalledOnceWith(1, wei, referralAddress);
  });
});
