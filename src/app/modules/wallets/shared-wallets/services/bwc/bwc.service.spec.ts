import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../../../../shared/services/language/language.service';
import { BwcService } from './bwc.service';
import BWC from 'bitcore-wallet-client';

const testOpts = {
  bwsurl: 'localhost',
};

const testWallet = {};
fdescribe('BwcService', () => {
  let service: BwcService;
  let languageServiceMock: any;
  let bwcSpy: any;

  beforeEach(() => {
    languageServiceMock = { selected: 'es' };
    bwcSpy = jasmine.createSpyObj('BWC', ['fromString']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
    });

    service = TestBed.inject(BwcService);
    service.Client = bwcSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a client instance when getClient is called', () => {
    service.Client = BWC;
    const client = service.getClient();
    expect(client).toBeInstanceOf(service.Client);
  });

  it('should create a client instance from the options when when getClient is called with an opts param', () => {
    service.Client = BWC;
    const client = service.getClient(null, testOpts);
    expect(client.request.baseUrl).toEqual(testOpts.bwsurl);
  });

  it('should create a wallet on createWallet');
});
