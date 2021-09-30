import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { UpdateAppService } from './update-app.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UpdateAppService', () => {
  let service: UpdateAppService;
  let alertControllerSpy: any;

  beforeEach(() => {
    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: AlertController, useValue: alertControllerSpy }],
    });
    service = TestBed.inject(UpdateAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  for (const { actual, expected, calledTimes } of [
    { actual: '1.0.0', expected: { version: '1.1.0', level: 'REQUIRED' }, calledTimes: 1 },
    { actual: '1.0.0', expected: { version: '1.1.0', level: 'RECOMMENDED' }, calledTimes: 1 },
    { actual: '1.0.0', expected: { version: '1.1.0', level: 'NOT_REQUIRED' }, calledTimes: 0 },
    { actual: '1.0.0', expected: { version: '1.0.0', level: 'REQUIRED' }, calledTimes: 0 },
    { actual: '1.0.0', expected: { version: '1.0.0', level: 'RECOMMENDED' }, calledTimes: 0 },
    { actual: '1.0.0', expected: { version: '1.0.0', level: 'NOT_REQUIRED' }, calledTimes: 0 },
  ]) {
    it(`should call ${calledTimes} times alert, actual version ${actual} expected version ${expected.version} and level ${expected.level}`, async () => {
      spyOn(service, 'getActualVersion').and.returnValue(Promise.resolve(actual));
      spyOn(service, 'getExpectedVersion').and.returnValue(Promise.resolve(expected));
      await service.checkForUpdate();
      expect(alertControllerSpy.create).toHaveBeenCalledTimes(calledTimes);
    });
  }
});
