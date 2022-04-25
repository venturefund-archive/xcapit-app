import { waitForAsync } from '@angular/core/testing';
import { TEST_ERC20_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { IFiatRampOperation } from '../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../interfaces/operation-status.interface';
import { FiatRampsService } from '../services/fiat-ramps.service';
import { FiatRampOperation } from './fiat-ramp-operation';

const provider: FiatRampProvider = {
  id: 1,
  alias: 'kripton',
  name: 'KriptonMarket',
  logoRoute: '../../assets/img/provider-logos/KriptonMarket.svg',
  newOperationRoute: '/fiat-ramps/new-operation',
};

const operationStatus: OperationStatus = {
  provider: provider,
  name: 'complete',
  textToShow: 'deposited',
  colorCssClass: 'success',
};

const operation: IFiatRampOperation = {
  operation_id: 1,
  provider: '1',
  currency_in: 'USDT',
  amount_in: 12,
  created_at: new Date(),
  status: 'pending_by_validate',
}

describe('FiatRampOperation', () => {
  let model: FiatRampOperation;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  beforeEach(
    waitForAsync(() => {
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: TEST_ERC20_COINS[2],
      });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getOperationStatus: operationStatus,
      });

      model = FiatRampOperation.create(
        operation,
        apiWalletServiceSpy,
        fiatRampsServiceSpy
      );
    })
  );

  it('should create', () => {
    expect(model).toBeTruthy();
  });

  it('should get operation status, provider and coin on create', () => {
    expect(model._aCoin.value).toEqual('USDT');
    expect(model._anOperationStatus.name).toEqual('complete');
    expect(model._aProvider.alias).toEqual('kripton');
  });
});
