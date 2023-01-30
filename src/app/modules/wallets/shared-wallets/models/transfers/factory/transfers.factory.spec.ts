import { TransfersFactory } from './transfers.factory';
import { rawMATICData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('TransfersFactory', () => {

  it('new', () => {
    expect(new TransfersFactory(null, null, null)).toBeTruthy();
  });

  it('create', () => {
    expect(new TransfersFactory(null, null, null).create(rawMATICData, '')).toBeTruthy();
  });
});
