import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiKeyDataGuard } from './apikey-data.guard';
import { StorageApikeysService } from '../../services/storage-apikeys/storage-apikeys.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('ApiKeyDataGuard', () => {
  let apiKeyDataGuard: ApiKeyDataGuard;
  let storageApikeysServiceMock: any;
  let storageApikeysService;
  let navControllerSpy: any;

  beforeEach(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    storageApikeysServiceMock = {
      valid: false
    };
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/tutorial', component: DummyComponent }
        ])
      ],
      providers: [
        ApiKeyDataGuard,
        { provide: StorageApikeysService, useValue: storageApikeysServiceMock },
        { provide: NavController, useValue: navControllerSpy }
      ]
    });
  });

  beforeEach(() => {
    apiKeyDataGuard = TestBed.inject(ApiKeyDataGuard);
    storageApikeysService = TestBed.inject(StorageApikeysService);
  });

  it('should ...', () => {
    expect(apiKeyDataGuard).toBeTruthy();
  });

  it('should be able to hit route when storageApikeysServiceSpy is false', () => {
    storageApikeysService.valid = false;
    apiKeyDataGuard
    .canActivate()
    .subscribe(result => expect(result).toBe(false));
  });

  it('should not be able to hit route when storageApikeysServiceSpy is true', () => {
    storageApikeysService.valid = true;
    apiKeyDataGuard
      .canActivate()
      .subscribe(result => expect(result).toBe(true));
  });
});
