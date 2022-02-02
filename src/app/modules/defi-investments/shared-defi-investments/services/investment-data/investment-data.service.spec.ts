import { InvestmentDataService } from './investment-data.service';
import { TestBed } from '@angular/core/testing';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';

describe('TwoPiInvestmentService', () => {
  let service: InvestmentDataService;
  let productSpy: jasmine.SpyObj<InvestmentProduct>;

  beforeEach(() => {
    productSpy = jasmine.createSpyObj('InvestmentProduct', {
      id: 1,
    });
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store investment data', () => {
    service.amount = 20;
    service.quoteAmount = 30;
    service.product = productSpy;

    expect(service.amount).toEqual(20);
    expect(service.quoteAmount).toEqual(30);
    expect(service.product).toEqual(productSpy);
  });
});
