import { TestBed } from "@angular/core/testing";
import { SolanaBalances } from "./solana-balances";
import { SolanaBalancesController } from "./solana-balances.controller";

describe('SolanaBalancesController', () => {
  let service: SolanaBalancesController;

  beforeEach(() => {
    service = TestBed.inject(SolanaBalancesController);
  });

  it('should create', () => {
    expect(service.new('11111111111111111111111111111111', [], 'https://testurl.com')).toBeInstanceOf(SolanaBalances);
  });

  it('should create with default', () => {
    expect(service.new('11111111111111111111111111111111', [])).toBeInstanceOf(SolanaBalances);
  });
});
