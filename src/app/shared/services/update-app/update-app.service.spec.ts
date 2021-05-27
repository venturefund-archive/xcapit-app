import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { UpdateAppService } from './update-app.service';

describe('UpdateAppService', () => {
  let service: UpdateAppService;
  let alertControllerSpy: any;
  let swUpdateSpy: any;

  beforeEach(() => {
    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
    swUpdateSpy = jasmine.createSpyObj('SwUpdate', ['update']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: SwUpdate, useValue: swUpdateSpy },
      ],
    });
    service = TestBed.inject(UpdateAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call alert controller create when showUpdateAppAlert is called', () => {
    // service.showUpdateAppAlert();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
