import { TestBed } from '@angular/core/testing';
import BalanceModalInjectable from './balance-modal.injectable';
import BalanceModal from '../balance-modal';

fdescribe('BalanceModalInjectable', () => {
  let service: BalanceModalInjectable;

  beforeEach(() => {
    service = TestBed.inject(BalanceModalInjectable);
  });

  it('create', () => {
    expect(service.create(null, null, null, null, null, null)).toBeInstanceOf(BalanceModal);
  });
});
