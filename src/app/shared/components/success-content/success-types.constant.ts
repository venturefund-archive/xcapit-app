export const SUCCESS_TYPES = {
  profile: {
    urlClose: '/tabs/home',
    textPrimary: 'profiles.success_profile.textPrimary',
    textSecondary: 'profiles.success_profile.textSecondary',
    urlPrimaryAction: '/apikeys/tutorial/exchange',
    namePrimaryAction: 'profiles.success_profile.namePrimaryAction',
    urlSecondaryAction: '/tabs/home',
    nameSecondaryAction: 'profiles.success_profile.nameSecondaryAction',
  },
  apikeys_new: {
    urlClose: '/tabs/home',
    textPrimary: 'apikeys.success_apikeys.textPrimary',
    textSecondary: 'apikeys.success_apikeys.textSecondary',
    urlPrimaryAction: '/funds/fund-name',
    namePrimaryAction: 'apikeys.success_apikeys.namePrimaryAction',
  },
  apikeys_edit: {
    urlClose: '/tabs/home',
    textPrimary: 'apikeys.success_apikeys_edition.textPrimary',
    textSecondary: 'apikeys.success_apikeys_edition.textSecondary',
    urlPrimaryAction: '/tabs/investments/binance',
    namePrimaryAction: 'apikeys.success_apikeys_edition.namePrimaryAction',
  },
  fund: {
    urlClose: '/tabs/investments/binance',
    textPrimary: 'funds.fund_success.textPrimary',
    textSecondary: 'funds.fund_success.textSecondary',
    urlPrimaryAction: '/tabs/investments/binance',
    namePrimaryAction: 'funds.fund_success.namePrimaryAction',
  },
  email_reset_password: {
    urlClose: '/users/login',
    textPrimary: 'users.reset_password.success_send_email_title',
    textSecondary: 'users.reset_password.success_send_email_text',
    urlPrimaryAction: '/users/login',
    namePrimaryAction: 'users.reset_password.success_button',
  },
  reset_password: {
    urlClose: '/users/login',
    textPrimary: 'users.reset_password.success_reset_password_header',
    textSecondary: 'users.reset_password.success_reset_password_message',
    urlPrimaryAction: '/users/login',
    namePrimaryAction: 'users.reset_password.success_button',
  },
  register: {
    urlClose: '/users/login',
    textPrimary: 'users.register.success_title',
    textSecondary: 'users.register.success_text',
    urlPrimaryAction: '/users/login',
    namePrimaryAction: 'users.register.accept_button',
    nameSecondaryAction: 'users.register.resend_email_button',
  },
  fund_renew: {
    urlClose: '/tabs/investments/binance',
    textPrimary: 'funds.fund_success_renew.textPrimary',
    textSecondary: 'funds.fund_success_renew.textSecondary',
    urlPrimaryAction: '/tabs/investments/binance',
    namePrimaryAction: 'funds.fund_success_renew.namePrimaryAction',
  },
  apikeys_register_success_beginner: {
    urlClose: '/tabs/home',
    urlPrimaryAction: '/funds/fund-name',
    urlSecondaryAction: '/tabs/home',
    urlThirdAction: '/fiat-ramps/moonpay',
    textPrimary: 'apikeys.register_success_beginner.textPrimary',
    textSecondary: 'apikeys.register_success_beginner.textSecondary',
    textThird: 'apikeys.register_success_beginner.textThird',
    namePrimaryAction: 'apikeys.register_success_beginner.namePrimaryAction',
    nameSecondaryAction: 'apikeys.register_success_beginner.nameSecondaryAction',
    nameThirdAction: 'apikeys.register_success_beginner.nameThirdAction',
  },
  apikeys_register_success: {
    urlClose: '/tabs/home',
    textPrimary: 'apikeys.register_success.textPrimary',
    textSecondary: 'apikeys.register_success.textSecondary',
    urlPrimaryAction: '/apikeys/list',
    namePrimaryAction: 'apikeys.register_success.namePrimaryAction',
    urlSecondaryAction: '/tabs/home',
    nameSecondaryAction: 'apikeys.register_success.nameSecondaryAction',
  },
  ticket_email_validation_create: {
    urlClose: '/users/login',
    textPrimary: 'tickets.createSuccess.textPrimary',
    textSecondary: 'tickets.createSuccess.textSecondary',
    urlPrimaryAction: '/users/login',
    namePrimaryAction: 'tickets.createSuccess.namePrimaryAction',
  },
  generic_ticket_create: {
    urlClose: '/tabs/home',
    textPrimary: 'tickets.create_support_ticket_success.textPrimary',
    textSecondary: 'tickets.create_support_ticket_success.textSecondary',
    urlPrimaryAction: '/tabs/home',
    namePrimaryAction: 'tickets.create_support_ticket_success.namePrimaryAction',
  },
  unsuccesful_mnemonic_verification: {
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.failed_mnemonic.title',
    textSecondary: 'wallets.failed_mnemonic.description',
    urlPrimaryAction: '/wallets/create-first/recovery-phrase',
    namePrimaryAction: 'wallets.failed_mnemonic.button',
  },
  wallet_send: {
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.send.send_success.textPrimary',
    textSecondary: 'wallets.send.send_success.textSecondary',
    urlPrimaryAction: '/tabs/wallets',
    namePrimaryAction: 'wallets.send.send_success.namePrimaryAction',
    trackClickEventNamePrimaryAction: 'ux_send_go_to_home',
  },
  error_wallet_recovery: {
    image: 'assets/img/wallets/error.svg',
    bottomImage: true,
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.error_wallet_recovery.title',
    textSecondary: 'wallets.error_wallet_recovery.description',
    urlPrimaryAction: '/wallets/recovery',
    namePrimaryAction: 'wallets.error_wallet_recovery.button',
  },
  success_wallet_recovery: {
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.success_wallet_recovery.title',
    urlPrimaryAction: '/tabs/wallets',
    namePrimaryAction: 'wallets.success_wallet_recovery.button',
    trackClickEventNamePrimaryAction: 'ux_import_go_to_home',
  },
  error_wallet_incorrect_password: {
    image: 'assets/img/defi-investments/error-investment.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.send.error_incorrect_password.textPrimary',
    namePrimaryAction: 'wallets.send.error_incorrect_password.namePrimaryAction',
  },
  error_wallet_wrong_amount: {
    image: 'assets/img/defi-investments/error-investment.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.send.error_wrong_amount.textPrimary',
    namePrimaryAction: 'wallets.send.error_wrong_amount.namePrimaryAction',
  },
  error_wallet_wrong_address: {
    image: 'assets/img/defi-investments/error-investment.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.send.error_wrong_address.textPrimary',
    namePrimaryAction: 'wallets.send.error_wrong_address.namePrimaryAction',
  },
  success_wallet_password_change: {
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.password_change_success.textPrimary',
    textSecondary: 'wallets.password_change_success.textSecondary',
    namePrimaryAction: 'wallets.password_change_success.namePrimaryAction',
    urlPrimaryAction: '/tabs/wallets',
  },
  error_wallet_password_change: {
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.password_change_error.textPrimary',
    textSecondary: 'wallets.password_change_success.textSecondary',
    namePrimaryAction: 'wallets.password_change_error.namePrimaryAction',
    urlPrimaryAction: '/wallets/password-change',
    nameSecondaryAction: 'wallets.password_change_error.nameSecondaryAction',
    urlSecondaryAction: '/tabs/wallets',
  },
  success_defi_withdraw: {
    image: 'assets/img/defi-investments/success-withdraw.svg',
    urlClose: '/tabs/investments',
    textPrimary: 'defi_investments.withdraw.success_withdraw.title',
    textSecondary: 'defi_investments.withdraw.success_withdraw.subtitle',
    namePrimaryAction: 'defi_investments.withdraw.success_withdraw.button_primary',
    urlPrimaryAction: '/tabs/investments',
    nameThirdAction: 'defi_investments.withdraw.success_withdraw.button_secondary',
    urlThirdAction: '/tabs/wallets',
    disclaimer: 'defi_investments.withdraw.success_withdraw.disclaimer',
  },

  success_donation: {
    image: '/assets/img/donations/success/success-donation.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'donations.success.textPrimary',
    textSecondary: 'donations.success.textSecondary',
    namePrimaryAction: 'donations.success.namePrimaryAction',
    urlPrimaryAction: '/donations/causes',
    nameThirdAction: 'donations.success.nameThirdAction',
    urlThirdAction: '/tabs/wallets',
  },

    error_donation: {
    image: '/assets/img/donations/error/error-donation.svg',
    urlClose: '/donations/causes',
    textPrimary: 'donations.error.textPrimary',
    textSecondary: 'donations.error.textSecondary',
    namePrimaryAction: 'donations.error.namePrimaryAction',
    urlPrimaryAction: '/donations/causes',
  },
  
  success_investment: {
    image: 'assets/img/defi-investments/success-investment.svg',
    urlClose: '/tabs/wallets',
    trackClickEventNameCloseAction: 'ux_invest_go_to_wallet',
    textPrimary: 'defi_investments.success_investment.title',
    textSecondary: 'defi_investments.success_investment.subtitle',
    namePrimaryAction: 'defi_investments.success_investment.primaryButton',
    urlPrimaryAction: '/tabs/investments',
    trackClickEventNamePrimaryAction: 'ux_invest_go_to_invest',
    nameThirdAction: 'defi_investments.success_investment.secondaryButton',
    urlThirdAction: '/tabs/wallets',
    trackClickEventNameThirdAction: 'ux_invest_go_to_wallet'
  },
  success_add_amount: {
    image: 'assets/img/defi-investments/success-add.svg',
    urlClose: '/tabs/wallets',
    trackClickEventNameCloseAction: 'ux_invest_go_to_wallet',
    textPrimary: 'defi_investments.success_add_amount.title',
    textSecondary: 'defi_investments.success_add_amount.subtitle',
    namePrimaryAction: 'defi_investments.success_add_amount.primaryButton',
    urlPrimaryAction: '/tabs/investments',
    trackClickEventNamePrimaryAction: 'ux_invest_go_to_invest',
    nameThirdAction: 'defi_investments.success_add_amount.secondaryButton',
    urlThirdAction: '/tabs/wallets',
    trackClickEventNameThirdAction: 'ux_invest_go_to_wallet'
  },
  error_investment: {
    image: 'assets/img/defi-investments/error-investment.svg',
    urlClose: '/tabs/investments',
    trackClickEventNameCloseAction: 'ux_invest_try_again',
    textPrimary: 'defi_investments.error_investment.title',
    textSecondary: 'defi_investments.error_investment.subtitle',
    namePrimaryAction: 'defi_investments.error_investment.primaryButton',
    urlPrimaryAction: '/tabs/investments',
    trackClickEventNamePrimaryAction: 'ux_invest_try_again',
  },
  success_objetive: {
    image: 'assets/img/financial-planner/success.svg',
    urlClose: '/financial-planner/new-objetive',
    textPrimary: 'financial_planner.new_objetive.success_title',
    textSecondary: 'financial_planner.new_objetive.success_subtitle',
    namePrimaryAction: 'financial_planner.new_objetive.success_button',
    urlPrimaryAction: '/financial-planner/new-objetive',
  },
  success_fiat_ramps:{
    image:"assets/img/fiat-ramps/success-page/operations-success.svg",
    textPrimary: 'fiat_ramps.fiat_success.textPrimary', 
    textSecondary:'fiat_ramps.fiat_success.textSecondary',
    namePrimaryAction:'fiat_ramps.fiat_success.buttonText',
    urlClose:'/fiat-ramps/new-operation',
    urlPrimaryAction:'/tabs/home'
  }
};
