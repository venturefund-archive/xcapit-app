import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { JsonRpcProviderInjectable } from './json-rpc-provider.injectable';
import { JsonRpcProvider } from '@ethersproject/providers';
import { fakeProviders } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-providers';

describe('JsonRpcProviderInjectable', () => {
  let service: JsonRpcProviderInjectable;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [],
    }).compileComponents();

    service = TestBed.inject(JsonRpcProviderInjectable);
  }));

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('create', () => {
    expect(service.create('anUrl', fakeProviders)).toBeInstanceOf(fakeProviders.JsonRpcProvider);
  });
});
