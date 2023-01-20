import { waitForAsync } from '@angular/core/testing';
import { TxInProgress } from './tx-in-progress';

describe('TxInProgress', () => {
  let object: TxInProgress;
  beforeEach(waitForAsync(() => {
    object = new TxInProgress('swap');
  }));

  it('create', () => {
    expect(object).toBeTruthy();
  });
});
