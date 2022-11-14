import { InvestmentMovement } from 'src/app/modules/wallets/shared-wallets/interfaces/investment-movement.interface';
import { YieldCalculator } from './yield-calculator.model';

describe('YieldCalculator', () => {
  let yieldCalculator: YieldCalculator;
  const movements: InvestmentMovement[] = [
    jasmine.createSpyObj('deposit', {}, { type: 'deposit', amount: '80000000000000000000' }),
    jasmine.createSpyObj('withdraw', {}, { type: 'withdraw', amount: '10000000000000000000' }),
  ];
  const movementsWithWithdrawAll: InvestmentMovement[] = [
    jasmine.createSpyObj('withdraw1', {}, { type: 'withdraw', amount: '10000000000000000000' }),
    jasmine.createSpyObj('deposit1', {}, { type: 'deposit', amount: '80000000000000000000' }),
    jasmine.createSpyObj('withdrawAll', {}, { type: 'withdraw', amount: '1000000000000000000', balance: "0" }),
    jasmine.createSpyObj('withdraw2', {}, { type: 'withdraw', amount: '20000000000000000000' }),
    jasmine.createSpyObj('deposit2', {}, { type: 'deposit', amount: '25000000000000000000' }),
  ];

  beforeEach(() => {
    yieldCalculator = new YieldCalculator(100, movements, 'WBTC', 2.5);
  });

  it('new', () => {
    expect(yieldCalculator).toBeTruthy();
  });

  it('cumulativeYield', () => {
    const result = yieldCalculator.cumulativeYield();
    expect(result.value).toEqual(30);
    expect(result.token).toEqual('WBTC');
  });

  it('cumulativeYieldUSD', () => {
    const result = yieldCalculator.cumulativeYieldUSD();
    expect(result.value).toEqual(75);
    expect(result.token).toEqual('USD');
  });

  it('cumulativeYield is negative', () => {
    const negativeMovements: InvestmentMovement[] = [
      jasmine.createSpyObj('deposit', {}, { type: 'deposit', amount: '25000000' }),
    ];
    const yieldCalculator = new YieldCalculator(24.999961, negativeMovements, 'USDC', 1, 6);
    const result = yieldCalculator.cumulativeYield();
    expect(result.value).toEqual(0);
    expect(result.token).toEqual('USDC');
  });

  it('cumulativeYield until last withdraw all', () => {
    const yieldCalculator = new YieldCalculator(100, movementsWithWithdrawAll, 'WBTC', 2.5);
    const result = yieldCalculator.cumulativeYieldUSD();
    expect(result.value).toEqual(75);
    expect(result.token).toEqual('USD');
  });
});
