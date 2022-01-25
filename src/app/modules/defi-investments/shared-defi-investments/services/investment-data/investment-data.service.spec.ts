import { InvestmentDataService } from './investment-data.service';
import { TestBed } from '@angular/core/testing';
import { Investment } from '../../models/two-pi-investment/two-pi-investment.model';

describe('TwoPiInvestmentService', () => {
  let service: InvestmentDataService;
  let investmentSpy: jasmine.SpyObj<Investment>;

  beforeEach(() => {
    investmentSpy = jasmine.createSpyObj('Investment', {
      balance: Promise.resolve(),
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
    service.investment = investmentSpy;

    expect(service.amount).toEqual(20);
    expect(service.quoteAmount).toEqual(30);
    expect(service.investment).toEqual(investmentSpy);
  });
});
