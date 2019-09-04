import { TestBed } from '@angular/core/testing';

import { TacHelperService } from './tac-helper.service';
import { of } from 'rxjs';
import { ApiTacService } from '../api-tac/api-tac.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TacHelperService', () => {
  let apiTacServiceMock: any;
  let service: TacHelperService;
  beforeEach(() => {
    apiTacServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['get'])
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiTacService, useValue: apiTacServiceMock }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(TacHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get on crud when isTaCAccepted, returned undefined', () => {
    apiTacServiceMock.crud.get.and.returnValue(of());
    service.isTaCAccepted('');
    expect(apiTacServiceMock.crud.get).toHaveBeenCalledTimes(1);
  });

  it('should call get on crud when isTaCAccepted, { accepted: true }', () => {
    apiTacServiceMock.crud.get.and.returnValue(of({ accepted: true }));
    service.isTaCAccepted('').subscribe(() => {
      expect(apiTacServiceMock.crud.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on crud when isTaCAccepted, { accepted: false }', () => {
    apiTacServiceMock.crud.get.and.returnValue(of({ accepted: false }));
    service.isTaCAccepted('').subscribe(() => {
      expect(apiTacServiceMock.crud.get).toHaveBeenCalledTimes(1);
    });
  });
});
