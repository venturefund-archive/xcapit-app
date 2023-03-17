import { TestBed } from '@angular/core/testing';
import { UserBankDataService } from './user-bank-data.service';

describe('UserBankDataService', () => {
  let service: UserBankDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBankDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clean', () => {
    service.clean();
    expect(service.userBankData).toBeUndefined();
  });

  it('set', () => {
    service.set({ account_type: 'ahorro' });
    expect(service.userBankData).toEqual({ account_type: 'ahorro' });
  });
});
