import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { FundDataStorageService } from './fund-data-storage.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FundDataStorageService', () => {
  let storageSpy: any;
  let storageService: any;
  let service: FundDataStorageService;
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    storageSpy.get.and.returnValue(new Promise(resolve => {}));
    storageSpy.set.and.returnValue(new Promise(resolve => {}));
    storageSpy.remove.and.returnValue(new Promise(resolve => {}));
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: Storage, useValue: storageSpy }]
    });
    storageService = TestBed.inject(Storage);
    service = TestBed.inject(FundDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call storage.get when getData  is called', () => {
    service.getData('testName');
    expect(storageService.get).toHaveBeenCalledTimes(1);
  });

  it('should call storage.set when setData  is called', () => {
    service.setData('testName', { testKet: 'testvalue' });
    expect(storageService.set).toHaveBeenCalledTimes(1);
  });

  it('should call storage.get when getFund  is called', () => {
    service.getFund();
    expect(storageService.get).toHaveBeenCalled();
  });

  it('should call storage.remove when clearAll  is called', () => {
    service.clearAll();
    expect(storageService.remove).toHaveBeenCalled();
  });

  it('should call storage.get when canActivatePage is called', () => {
    service.canActivatePage('testurl');
    expect(storageService.get).toHaveBeenCalledTimes(1);
  });
});
