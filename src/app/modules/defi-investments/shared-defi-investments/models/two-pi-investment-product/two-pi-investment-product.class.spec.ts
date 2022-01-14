import { TEST_MATIC_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TEST_VAULTS } from '../../constants/test-vault.spec';
import { TwoPiInvestmentProduct } from './two-pi-investment-product.class';

const testVaultUSDC = TEST_VAULTS[0]
describe('TwoPiInvestmentProduct', () => {
  let twoPiInvestmentProduct: TwoPiInvestmentProduct;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoins: TEST_MATIC_COINS });
  });

  it('should create', () => {
    twoPiInvestmentProduct = new TwoPiInvestmentProduct(testVaultUSDC, apiWalletServiceSpy);
    expect(twoPiInvestmentProduct).toBeTruthy();
  });
});
