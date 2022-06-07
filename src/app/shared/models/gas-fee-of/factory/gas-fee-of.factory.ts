import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { FakeContract } from '../../../../modules/defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { GasFeeOf } from '../gas-fee-of.model';

@Injectable({ providedIn: 'root' })
export class GasFeeOfFactory {
  constructor() {}

  new(_aContract: Contract | FakeContract, _aMethodName: string, _args: any[]): GasFeeOf {
    return new GasFeeOf(_aContract, _aMethodName, _args);
  }
}
