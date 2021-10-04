import { StrategyNamePipe } from './strategy-name.pipe';

describe('StrategyNamePipe', () => {
  it('create an instance', () => {
    const translateService = jasmine.createSpyObj('TranslateService', ['instant']);
    const pipe = new StrategyNamePipe(translateService);
    expect(pipe).toBeTruthy();
  });
});
