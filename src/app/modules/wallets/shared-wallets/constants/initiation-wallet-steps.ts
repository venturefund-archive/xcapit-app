export const INITIATION_WALLET_STEPS = [
  {
    icon: 'ux-currency-info-backgroun',
    title: 'wallets.experimental_onboarding.steps.step_one.title',
    subtitle: 'wallets.experimental_onboarding.steps.step_one.subtitle',
    url: '/fiat-ramps/select-provider',
    name: 'ux_exp_buy',
    isComplete: false,
  },
  {
    icon: 'ux-arrow-narrow-down-backgroun',
    title: 'wallets.experimental_onboarding.steps.step_two.title',
    subtitle: 'wallets.experimental_onboarding.steps.step_two.subtitle',
    url: '/wallets/receive/detail?asset=USDC&network=MATIC',
    name: 'ux_exp_deposit',
    isComplete: false,
  },
  {
    icon: 'checkmark-circle-backgroun',
    title: 'wallets.experimental_onboarding.steps.step_three.title',
    isComplete: true,
  },
];
