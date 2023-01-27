import { TestBed } from '@angular/core/testing';
import { FormattedFeeInjectable } from './formatted-fee.injectable';
import { Fee } from '../../../interfaces/fee.interface';
import { FormattedFee } from '../formatted-fee.model';

describe('FormattedFeeInjectable', () => {
  let service: FormattedFeeInjectable;
  let feeSpy: jasmine.SpyObj<Fee>;

  beforeEach(() => {
    service = TestBed.inject(FormattedFeeInjectable);
    feeSpy = jasmine.createSpyObj('Fee', ['value']);
  });

  it('should create with default decimals', () => {
    expect(service.create(feeSpy)).toBeInstanceOf(FormattedFee);
  });

  it('should create with specific decimals', () => {
    expect(service.create(feeSpy, 10)).toBeInstanceOf(FormattedFee);
  });
});
