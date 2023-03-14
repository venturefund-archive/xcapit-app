import { rawTokensData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { TokenRepo } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultTokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';
import { rawNativeEvent } from '../../../fixtures/raw-bitrefill-operation-data';
import { BitrefillOperationFactory } from './bitrefill-operation.factory';

describe('Bitrefill Operation Factory', () => {
  const tokens = new DefaultTokens(new TokenRepo(rawTokensData));

  it('new', () => {
    expect(new BitrefillOperationFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(new BitrefillOperationFactory().create(rawNativeEvent, tokens)).toBeTruthy();
  });
});
