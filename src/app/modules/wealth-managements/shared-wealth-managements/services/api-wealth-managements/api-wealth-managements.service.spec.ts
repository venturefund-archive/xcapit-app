import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

import { ApiWealthManagementsService } from './api-wealth-managements.service';

describe('ApiWealthManagementsService', () => {
  let service: ApiWealthManagementsService;
  let crudSpy: jasmine.SpyObj<CrudService>;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({}),
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
      ],
    });
    service = TestBed.inject(ApiWealthManagementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call get on getInvestorTestQuestions', () => {
  //   service.getInvestorTestQuestions().subscribe(() => {
  //     expect(customHttpServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String), undefined, undefined, false);
  //   });
  // });

  // it('should call post on saveInvestorTestScore with score', () => {
  //   service.saveInvestorTestScore(10).subscribe(() => {
  //     expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), { score: 10 }, undefined, false);
  //   });
  // });

  // it('should call get on getInvestorProfile', () => {
  //   service.getInvestorProfile().subscribe(() => {
  //     expect(customHttpServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String), undefined, undefined, false);
  //   });
  // });
});
