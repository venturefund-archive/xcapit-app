import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { LogOutModalService } from './log-out-modal.service';

describe('LogOutModalService', () => {
  let service: LogOutModalService;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;

  beforeEach(waitForAsync(() => {
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
      get: Promise.resolve(['test@email.com']),
      set: Promise.resolve()
    })
    TestBed.configureTestingModule({
      providers: [
        { provide: AppStorageService, useValue: appStorageServiceSpy },
      ]
    });
    service = TestBed.inject(LogOutModalService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add user to not show modal on addUserToNotShowModal', async () => {
    await service.addUserToNotShowModal('test2@email.com');
    expect(appStorageServiceSpy.set).toHaveBeenCalledOnceWith('not_show_modal_users', ['test@email.com', 'test2@email.com']);
  });

  it('should add user to not show modal if there is no variable on local storage on addUserToNotShowModal', async () => {
    appStorageServiceSpy.get.and.returnValue(Promise.resolve(null));
    await service.addUserToNotShowModal('test@email.com');
    expect(appStorageServiceSpy.set).toHaveBeenCalledOnceWith('not_show_modal_users', ['test@email.com']);
  });

  it('should return false if there is no variable on local storage on isShowModalTo', async () => {
    appStorageServiceSpy.get.and.returnValue(Promise.resolve(null));
    const result = await service.isShowModalTo('test@email.com');
    expect(result).toBeTrue();
  });

  it('should return false if list is empty on isShowModalTo', async () => {
    appStorageServiceSpy.get.and.returnValue(Promise.resolve([]));
    const result = await service.isShowModalTo('test@email.com');
    expect(result).toBeTrue();
  });

  it('should return false if user is not on list on isShowModalTo', async () => {
    const result = await service.isShowModalTo('test2@email.com');
    expect(result).toBeTrue();
  });

  it('should return true if user is on list isShowModalTo', async () => {
    const result = await service.isShowModalTo('test@email.com');
    expect(result).toBeFalse();
  });
});
