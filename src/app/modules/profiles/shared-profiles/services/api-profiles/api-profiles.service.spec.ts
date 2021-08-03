import { TestBed } from '@angular/core/testing';

import { ApiProfilesService } from './api-profiles.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ApiProfilesService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let service: ApiProfilesService;
  const testPersonalData = {
    first_name: 'Test',
    last_name: 'Test last',
    nro_dni: '21312731823',
    cellphone: '123123123123',
  };

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['get', 'put']);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.inject(ApiProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call CustomHttpService get when profileValid', () => {
    service.profileValid();
    expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call CustomHttpService put when updatePersonalData', () => {
    service.updatePersonalData(testPersonalData);
    expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
  });
});
