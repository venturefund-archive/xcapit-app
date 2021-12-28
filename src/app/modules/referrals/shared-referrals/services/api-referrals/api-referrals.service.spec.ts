import { TestBed } from '@angular/core/testing';
import { ApiReferralsService } from './api-referrals.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { FakeLoadingService } from '../../../../../../testing/fakes/loading.fake.spec';
import { CrudService } from '../../../../../shared/services/crud/crud.service';

describe('ApiReferralsService', () => {
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;
  let crudSpy: any;
  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
  });

  it('should be created', () => {
    const service: ApiReferralsService = TestBed.inject(ApiReferralsService);
    expect(service).toBeTruthy();
  });
});
