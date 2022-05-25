import { constants, VoidSigner } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { InvestmentProduct } from '../../../interfaces/investment-product.interface';
import { TwoPiInvestmentFactory } from './two-pi-investment-factory';
import { TwoPiInvestment } from '../two-pi-investment.model';

describe('TwoPiInvestmentFactory', () => {
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
      token: coinSpy,
      contractAddress: constants.AddressZero,
    });
  });
  it('create', () => {
    expect(new TwoPiInvestmentFactory()).toBeTruthy();
  });

  it('new', () => {
    expect(
      new TwoPiInvestmentFactory().new(investmentProductSpy, new VoidSigner(constants.AddressZero), apiWalletServiceSpy)
    ).toBeInstanceOf(TwoPiInvestment);
  });
});
