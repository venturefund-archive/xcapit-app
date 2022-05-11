import { TestBed } from '@angular/core/testing';
import { FormattedFeeController } from './formatted-fee.controller';
import { Fee } from '../../../interfaces/fee.interface';
import { FormattedFee } from '../formatted-fee.model';

describe('FormattedFeeController', () => {
  let service: FormattedFeeController;
  let feeSpy: jasmine.SpyObj<Fee>;

  beforeEach(() => {
    service = TestBed.inject(FormattedFeeController);
    feeSpy = jasmine.createSpyObj('Fee', ['value']);
  });

  it('should create with default decimals', () => {
    expect(service.new(feeSpy)).toBeInstanceOf(FormattedFee);
  });

  it('should create with specific decimals', () => {
    expect(service.new(feeSpy, 10)).toBeInstanceOf(FormattedFee);
  });
});
