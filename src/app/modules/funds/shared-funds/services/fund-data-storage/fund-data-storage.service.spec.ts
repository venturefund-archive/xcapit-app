import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { FundDataStorageService } from './fund-data-storage.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FundDataStorageService', () => {
  let storageSpy: any;
  let service: FundDataStorageService;
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: Storage, useValue: storageSpy }]
    });
    service = TestBed.get(FundDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call storage.get when getData  is called', () => {
    service.getData('testName');
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call storage.set when setData  is called', () => {
    service.setData('testName', { testKet: 'testvalue' });
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should call storage.get when getFund  is called', () => {
    service.getFund();
    expect(storageSpy.get).toHaveBeenCalled();
  });

  it('should call storate.remove when clearAll  is called', () => {
    service.clearAll();
    expect(storageSpy.remove).toHaveBeenCalled();
  });

  it('should call storate.get when canActivatePage is called', () => {
    service.canActivatePage('testurl');
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });
});
