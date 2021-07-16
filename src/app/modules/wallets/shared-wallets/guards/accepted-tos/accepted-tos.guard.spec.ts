import { TestBed } from '@angular/core/testing';

import { AcceptedToSGuard } from './accepted-tos.guard';
import { StorageWalletsService } from '../../services/storage-wallets/storage-wallets.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';

fdescribe('AcceptedToSGuard', () => {
  let guard: AcceptedToSGuard;
  const storageWalletServiceMock = {
    hasAcceptedToS: () => Promise.resolve(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'wallets/create-first/disclaimer', component: DummyComponent }]),
      ],
      providers: [{ provide: StorageWalletsService, useValue: storageWalletServiceMock }],
    });
    guard = TestBed.inject(AcceptedToSGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
