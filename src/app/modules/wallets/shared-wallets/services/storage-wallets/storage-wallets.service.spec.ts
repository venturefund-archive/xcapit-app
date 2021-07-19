import { TestBed } from '@angular/core/testing';
import { StorageWalletsService } from './storage-wallets.service';
import { Storage } from '@ionic/storage';

describe('StorageWalletsService', () => {
  let service: StorageWalletsService;
  let storageSpy: any;
  storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }],
    });
    service = TestBed.inject(StorageWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the value in the storage on setValue', async () => {
    await service.setValue('key', 'value');
    expect(storageSpy.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should get the value in the storage on getValue', async () => {
    await service.getValue('value');
    expect(storageSpy.get).toHaveBeenCalledWith('value');
  });

  it('should return true on hasAcceptedToS when userAcceptedToS is true', async () => {
    spyOn(service, 'getValue').and.returnValue(Promise.resolve(true));
    const userAcceptedToS = await service.hasAcceptedToS();
    expect(userAcceptedToS).toBeTrue();
  });

  it('should return false on hasAcceptedToS when userAcceptedToS is undefined', async () => {
    spyOn(service, 'getValue').and.returnValue(Promise.resolve(undefined));
    const userAcceptedToS = await service.hasAcceptedToS();
    expect(userAcceptedToS).toBeFalse();
  });

  it('should set userAcceptedToS to true on acceptToS', async () => {
    const spy = spyOn(service, 'setValue');
    await service.acceptToS();
    expect(spy).toHaveBeenCalledWith('userAcceptedToS', true);
  });
});
