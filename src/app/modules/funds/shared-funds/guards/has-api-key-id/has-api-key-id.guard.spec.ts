import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HasApiKeyIdGuard } from './has-api-key-id.guard';
import { StorageApikeysService } from '../../../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';

describe('IsOwnerGuard', () => {
  let hasApiKeyIdGuard: HasApiKeyIdGuard;
  let storageApikeysServiceSpy: jasmine.SpyObj<StorageApikeysService>;

  beforeEach(() => {
    storageApikeysServiceSpy = jasmine.createSpyObj(
      'StorageApikeysService',
      {},
      {
        data: { id: 18 },
      }
    );
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [HasApiKeyIdGuard, { provide: StorageApikeysService, useValue: storageApikeysServiceSpy }],
    });
  });

  beforeEach(() => {
    hasApiKeyIdGuard = TestBed.inject(HasApiKeyIdGuard);
  });

  it('should create', () => {
    expect(hasApiKeyIdGuard).toBeTruthy();
  });

  it('should be able to hit route when api key id exists', () => {
    expect(hasApiKeyIdGuard.canActivate()).toBe(true);
  });

  it('should be able to hit route when api key id not exists', () => {
    delete storageApikeysServiceSpy.data.id;
    expect(hasApiKeyIdGuard.canActivate()).toBe(false);
  });
});
