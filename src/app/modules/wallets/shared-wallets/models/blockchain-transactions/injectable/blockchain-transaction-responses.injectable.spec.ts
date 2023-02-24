import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BlockchainTransactionResponses } from '../blockchain-transaction-responses';
import { BlockchainTransactionResponsesInjectable } from './blockchain-transaction-responses.injectable';

describe('blockchainTransactionResponsesInjectable', () => {
  let service: BlockchainTransactionResponsesInjectable;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [],
    }).compileComponents();

    service = TestBed.inject(BlockchainTransactionResponsesInjectable);
  }));

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('create', () => {
    expect(service.create(null)).toBeInstanceOf(BlockchainTransactionResponses);
  });
});
