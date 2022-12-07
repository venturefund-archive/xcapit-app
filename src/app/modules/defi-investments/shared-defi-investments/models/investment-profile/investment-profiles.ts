import { RawInvestmentProfile } from '../../types/raw-investment-profile.type';

export class InvestmentProfiles {
  public all(): RawInvestmentProfile[] {
    return [
      {
        title: 'wealth_managements.about_investor_profile.conservative_profile.title',
        value: 'conservative',
        dataToTrack: 'ux_invest_conservative',
      },
      {
        title: 'wealth_managements.about_investor_profile.moderated_profile.title',
        value: 'medium',
        dataToTrack: 'ux_invest_moderate',
      },
      {
        title: 'wealth_managements.about_investor_profile.aggressive_profile.title',
        value: 'risky',
        dataToTrack: 'ux_invest_aggressive',
      },
    ];
  }
}
