import { TestBed } from '@angular/core/testing';

import { BwcService } from './bwc.service';

const testOpts = {
  bwsurl: 'localhost',
};

const testWallet = {};
fdescribe('BwcService', () => {
  let service: BwcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BwcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a client instance when getClient is called', () => {
    const client = service.getClient();
    expect(client).toBeInstanceOf(service.Client);
  });

  it('should create a client instance from the options when when getClient is called with an opts param', () => {
    const client = service.getClient(null, testOpts);
    expect(client.request.baseUrl).toEqual(testOpts.bwsurl);
  });
});
