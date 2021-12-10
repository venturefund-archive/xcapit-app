import { TestBed } from '@angular/core/testing';
import { UpdatePWAService } from './update-pwa.service';
import { TranslateModule } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../loading/loading.service';
import { FakeLoadingService } from '../../../../testing/fakes/loading.fake.spec';

describe('UpdatePWAService', () => {
  let service: UpdatePWAService;
  let alertControllerSpy: any;
  let swUpdateSpy: any;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;

  beforeEach(() => {
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
    swUpdateSpy = jasmine.createSpyObj('SwUpdate', ['update']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: SwUpdate, useValue: swUpdateSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(UpdatePWAService);
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
