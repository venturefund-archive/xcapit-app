import { FundActionFormTextButtonPipe } from './fund-action-form-text-button.pipe';
import { FundFormActions } from '../../../shared-funds/enums/fund-form-actions.enum';

describe('FundActionFormTextButtonPipe', () => {

  const pipe = new FundActionFormTextButtonPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Isolate pipe test', () => {
    it('shoud return NewFund key to translate', () => {
      expect(pipe.transform(FundFormActions.NewFund))
        .toBe('funds.new_fund.submit_button_new');
    });

    it('shoud return ReNewFund key to translate', () => {
      expect(pipe.transform(FundFormActions.RenewFund))
        .toBe('funds.new_fund.submit_button_renew');
    });

    it('shoud return EditFund key to translate', () => {
      expect(pipe.transform(FundFormActions.EditProfitLoss))
        .toBe('funds.new_fund.submit_button_edit');
    });
  });
});
