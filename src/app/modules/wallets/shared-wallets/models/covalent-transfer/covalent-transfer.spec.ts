import { CovalentTransfer } from './covalent-transfer';

const transfer = {
  from_address: 'testFromAddress',
  to_address: 'testToAddress',
};

describe('CovalentTransfer', () => {
  it('should create', () => {
    expect(new CovalentTransfer(transfer, 'USD')).toBeTruthy();
  });
});
