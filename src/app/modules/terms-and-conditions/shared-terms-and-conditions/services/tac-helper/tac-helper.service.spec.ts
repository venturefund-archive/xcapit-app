import { TestBed } from '@angular/core/testing';

import { TacHelperService } from './tac-helper.service';
import { of } from 'rxjs';
import { ApiTacService } from '../api-tac/api-tac.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('TacHelperService', () => {
  let apiTacServiceMock: any;
  let service: TacHelperService;
  let navControllerSpy: any;

  beforeEach(() => {
    apiTacServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['get'])
    };
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiTacService, useValue: apiTacServiceMock },
        { provide: NavController, useValue: navControllerSpy }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TacHelperService);
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

  // tslint:disable-next-line: max-line-length
  it('should call navigateForward with ["/terms-and-conditions/accept"], { replaceUrl: true } on navController when isTaCAccepted, { accepted: false }', () => {
    apiTacServiceMock.crud.get.and.returnValue(of({ accepted: false }));
    service.isTaCAccepted('').subscribe(() => {
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
        ['/terms-and-conditions/accept'],
        { replaceUrl: true }
      );
    });
  });
});
