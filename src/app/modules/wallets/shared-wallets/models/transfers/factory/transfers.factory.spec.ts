import { TransfersFactory } from './transfers.factory';
import { rawMATICData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('TransfersFactory', () => {
  it('create', () => {
    expect(new TransfersFactory().create(rawMATICData, '')).toBeTruthy();
  });
});
