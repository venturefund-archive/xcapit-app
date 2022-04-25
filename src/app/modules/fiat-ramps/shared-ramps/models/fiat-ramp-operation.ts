import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { IFiatRampOperation } from '../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../interfaces/operation-status.interface';
import { FiatRampsService } from '../services/fiat-ramps.service';

export class FiatRampOperation {
  constructor(
    readonly _anId: number,
    readonly _aCoin: Coin,
    readonly _anAmount: number,
    readonly _aCreationDate: Date,
    readonly _anOperationStatus: OperationStatus
  ) {}

  public get _aProvider(): FiatRampProvider {
    return this._anOperationStatus.provider;
  }

  static create(
    operation: IFiatRampOperation,
    apiWalletService: ApiWalletService,
    fiatRampsService: FiatRampsService
  ): FiatRampOperation {
    const operationStatus = fiatRampsService.getOperationStatus(operation.status, parseInt(operation.provider));
    const coin = apiWalletService.getCoin(operation.currency_in);

    return new this(operation.operation_id, coin, operation.amount_in, operation.created_at, operationStatus);
1  }
}
