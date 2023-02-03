import { Injectable } from '@angular/core';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';
import { DefaultBitrefillOperation } from '../default-bitrefill-operation';

@Injectable({ providedIn: 'root' })
export class BitrefillOperationFactory {
  create(operation: any, tokens: Tokens, blockchains: Blockchains): DefaultBitrefillOperation {
    return new DefaultBitrefillOperation(operation, tokens, blockchains);
  }
}
