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

  it('should call get on getInvestorTestQuestions', () => {
    service.getInvestorTestQuestions().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });
});
