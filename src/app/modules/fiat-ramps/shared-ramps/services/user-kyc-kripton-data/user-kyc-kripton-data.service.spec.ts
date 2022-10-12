import { TestBed } from '@angular/core/testing';
import { UserKycKriptonDataService } from './user-kyc-kripton-data.service';

describe('UserKycKriptonDataService', () => {
  let service: UserKycKriptonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserKycKriptonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clean', () => {
    service.clean();
    expect(service.userKycKriptonData).toBeUndefined();
  });
});
