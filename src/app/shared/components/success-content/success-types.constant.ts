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
  success_profile_test: {
    image: '/assets/img/profiles/success-profile-test.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'profiles.success_profile_test.text_primary',
    urlPrimaryAction: '/tabs/wallets',
    namePrimaryAction: 'profiles.success_profile_test.name_primary_action',
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
    image: 'assets/img/users/success-register/success-register.svg',
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
    urlThirdAction: '/fiat-ramps/new-operation/moonpay',
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
    bottomImage: true,
    hasToTrackScreenview: true,
    screenviewEventLabel: 'ux_protect_screenview_error',
    image: 'assets/img/wallets/failed_mnemonic.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.failed_mnemonic.title',
    textSecondary: 'wallets.failed_mnemonic.description',
    urlPrimaryAction: '/wallets/recovery/read',
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
    image: 'assets/img/wallets/success_celebration.svg',
    textSecondary: 'wallets.success_wallet_recovery.subtitle',
    urlPrimaryAction: '/profiles/profile-test',
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
    image: 'assets/img/wallet-password-change/password-change-success.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.password_change_success.textPrimary',
    textSecondary: 'wallets.password_change_success.textSecondary',
    namePrimaryAction: 'wallets.password_change_success.namePrimaryAction',
    urlPrimaryAction: '/tabs/wallets',
  },
  error_wallet_password_change: {
    image: 'assets/img/wallet-password-change/password-change-error.svg',
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
    trackClickEventNamePrimaryAction: 'ux_invest_go_to_invest',
    urlPrimaryAction: '/tabs/investments',
    nameThirdAction: 'defi_investments.withdraw.success_withdraw.button_secondary',
    trackClickEventNameThirdAction: 'ux_invest_go_to_wallet',
    urlThirdAction: '/tabs/wallets',
    disclaimer: 'defi_investments.withdraw.success_withdraw.disclaimer',
  },

  success_donation: {
    image: '/assets/img/donations/success/success-donation.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'donations.success.textPrimary',
    textSecondary: 'donations.success.textSecondary',
    namePrimaryAction: 'donations.success.namePrimaryAction',
    trackClickEventNamePrimaryAction: 'ux_donations_go_to_donations',
    urlPrimaryAction: '/donations/causes',
    nameThirdAction: 'donations.success.nameThirdAction',
    trackClickEventNameThirdAction: 'ux_donations_go_to_home',
    urlThirdAction: '/tabs/wallets',
  },

  error_donation: {
    image: '/assets/img/donations/error/error-donation.svg',
    urlClose: '/donations/causes',
    textPrimary: 'donations.error.textPrimary',
    textSecondary: 'donations.error.textSecondary',
    namePrimaryAction: 'donations.error.namePrimaryAction',
    trackClickEventNamePrimaryAction: 'ux_donations_go_to_donations',
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
    trackClickEventNameThirdAction: 'ux_invest_go_to_wallet',
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
    trackClickEventNameThirdAction: 'ux_invest_go_to_wallet',
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
  success_fiat_ramps: {
    image: 'assets/img/fiat-ramps/success-page/operations-success.svg',
    urlClose: '/fiat-ramps/select-provider',
    textPrimary: 'fiat_ramps.fiat_success.textPrimary',
    textSecondary: 'fiat_ramps.fiat_success.textSecondary',
    namePrimaryAction: 'fiat_ramps.fiat_success.buttonText',
    urlPrimaryAction: '/fiat-ramps/operation-detail/provider/1/operation/',
    trackClickEventNamePrimaryAction: 'ux_buy_kripton_details',
  },
  error_d24_operation: {
    image: '/assets/img/fiat-ramps/error-d24-buy/error-buy.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'fiat_ramps.error_d24_operation.text_primary',
    textSecondary: 'fiat_ramps.error_d24_operation.text_secondary',
    namePrimaryAction: 'fiat_ramps.error_d24_operation.button_primary',
    urlPrimaryAction: '/fiat-ramps/token-selection',
    nameSecondaryAction: 'fiat_ramps.error_d24_operation.button_secondary',
    urlSecondaryAction: 'tabs/wallets',
   },
  success_d24_operation: {
    image: '/assets/img/fiat-ramps/success-d24-buy/success-buy.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'fiat_ramps.success_d24_operation.text_primary',
    textSecondary: 'fiat_ramps.success_d24_operation.text_secondary',
    namePrimaryAction: 'fiat_ramps.success_d24_operation.button_text',
    urlPrimaryAction: '/tabs/wallets',
  },

  error_test_financial_education: {
    image: '/assets/img/financial-education/error-test-financial-education.svg',
    textPrimary: 'financial_education.error_test.textPrimary',
    textSecondary: 'financial_education.error_test.textSecondary',
    namePrimaryAction: 'financial_education.error_test.namePrimaryAction',
    trackClickEventNamePrimaryAction: 'ux_education_retry_module',
    urlPrimaryAction: '',
    nameSecondaryAction: 'financial_education.error_test.nameSecondaryAction',
    urlSecondaryAction: 'tabs/financial-education',
    trackClickEventNameSecondaryAction: 'ux_education_go_to_menu',
    nameThirdAction: 'financial_education.error_test.nameThirdAction',
    urlThirdAction: '',
  },
  success_submodules: {
    image: 'assets/img/financial-education/success-submodules/success-submodules.svg',
    textPrimary: 'financial_education.success_submodule.textPrimary',
    textSecondary: 'financial_education.success_submodule.textSecondary',
    namePrimaryAction: 'financial_education.success_submodule.buttonText',
    nameThirdAction: 'financial_education.success_submodule.buttonText2',
    urlPrimaryAction: '/tabs/financial-education',
    urlThirdAction: 'tabs/financial-education',
    trackClickEventNamePrimaryAction: 'ux_education_next_module',
    trackClickEventNameThirdAction: 'ux_education_go_to_menu',
  },
  final_success_test: {
    image: 'assets/img/financial-education/final-success-test.svg',
    textPrimary: 'financial_education.final_success_test.textPrimary',
    textSecondary: 'financial_education.final_success_test.textSecondary',
    namePrimaryAction: 'financial_education.final_success_test.primaryButton',
    urlPrimaryAction: 'tabs/financial-education',
    trackClickEventNamePrimaryAction: 'ux_education_finalize',
  },
  swap_in_progress: {
    image: 'assets/img/swaps/swap-in-progress.svg',
    icon: 'assets/img/swaps/swap-icon.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'swaps.swap_in_progress.text_primary',
    textSecondary: 'swaps.swap_in_progress.text_secondary',
    namePrimaryAction: 'swaps.swap_in_progress.button_text',
    urlPrimaryAction: '/tabs/wallets',
    titlePrimary: 'swaps.swap_in_progress.text_title',
    textBadge: 'swaps.swap_in_progress.text_badge',
  },
  invest_in_progress: {
    image: 'assets/img/defi-investments/no-investments.svg',
    icon: 'assets/img/defi-investments/invest-icon.svg',
    urlClose: '/tabs/investments',
    textPrimary: 'defi_investments.invest_in_progress.text_primary',
    textSecondary: 'defi_investments.invest_in_progress.text_secondary',
    namePrimaryAction: 'defi_investments.invest_in_progress.button_text',
    urlPrimaryAction: '/tabs/investments',
    titlePrimary: 'defi_investments.invest_in_progress.text_title',
    textBadge: 'defi_investments.invest_in_progress.text_badge',
  },
  send_in_progress: {
    image: 'assets/img/wallets/send-in-progress.svg',
    icon: 'assets/img/wallets/send-icon.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'wallets.send.send_in_progress.text_primary',
    textSecondary: 'wallets.send.send_in_progress.text_secondary',
    namePrimaryAction: 'wallets.send.send_in_progress.button_text',
    urlPrimaryAction: '/tabs/wallets',
    titlePrimary: 'wallets.send.send_in_progress.text_title',
    textBadge: 'wallets.send.send_in_progress.text_badge',
    textSaveWallet:'wallets.send.send_in_progress.text_save'
  },
  withdraw_in_progress: {
    image: 'assets/img/defi-investments/withdraw-in-progress.svg',
    icon: 'assets/img/defi-investments/withdraw-icon.svg',
    urlClose: '/tabs/investments',
    textPrimary: 'defi_investments.withdraw_in_progress.text_primary',
    textSecondary: 'defi_investments.withdraw_in_progress.text_secondary',
    namePrimaryAction: 'defi_investments.withdraw_in_progress.button_text',
    urlPrimaryAction: '/tabs/investments',
    titlePrimary: 'defi_investments.withdraw_in_progress.text_title',
    textBadge: 'defi_investments.withdraw_in_progress.text_badge',
  },
  error_no_wallet_financial_education: {
    image: '/assets/img/financial-education/error-no-wallet.svg',
    urlClose: '/tabs/financial-education',
    textPrimary: 'financial_education.error_no_wallet.textPrimary',
    textSecondary: 'financial_education.error_no_wallet.textSecondary',
    namePrimaryAction: 'financial_education.error_no_wallet.namePrimaryAction',
    nameSecondaryAction: 'financial_education.error_no_wallet.nameSecondaryAction',
    urlPrimaryAction: '/tabs/wallets',
    urlSecondaryAction: '/tabs/financial-education',
  },
  operation_km_in_progress: {
    urlClose: '/fiat-ramps/purchases',
    image: '/assets/img/fiat-ramps/opeartion-km-in-progress/operation-km-in-progress.svg',
    icon: '/assets/img/fiat-ramps/opeartion-km-in-progress/operation-icon.svg',
    titlePrimary: 'fiat_ramps.operation_km_in_progress.text_title',
    textBadge: 'fiat_ramps.operation_km_in_progress.text_badge',
    textPrimary: 'fiat_ramps.operation_km_in_progress.text_primary',
    textSecondary: 'fiat_ramps.operation_km_in_progress.text_secondary',
    textTertiary: 'fiat_ramps.operation_km_in_progress.text_tertiary',
    namePrimaryAction: 'fiat_ramps.operation_km_in_progress.button_text',
    urlPrimaryAction: '/fiat-ramps/purchases',
    textHelpLink: 'fiat_ramps.operation_km_in_progress.text_help_link',
  },
  error_operation_km: {
    image: '/assets/img/fiat-ramps/error-operation-km/error-buy.svg',
    urlClose: '/fiat-ramps/purchases',
    textPrimary: 'fiat_ramps.error_operation_km.text_primary',
    textSecondary: 'fiat_ramps.error_operation_km.text_secondary',
    namePrimaryAction: 'fiat_ramps.error_operation_km.button_primary',
    nameSecondaryAction: 'fiat_ramps.error_operation_km.button_secondary',
    urlSecondaryAction: '/fiat-ramps/purchases',
  },
  create_ticket_wallet: {
    image: 'assets/img/support-ticket/create-ticket-success.svg',
    textPrimary: 'tickets.create_support_ticket_success_new_login.textPrimary',
    textSecondary: 'tickets.create_support_ticket_success_new_login.textSecondary',
    namePrimaryAction: 'tickets.create_support_ticket_success_new_login.has_wallet.namePrimaryAction',
    nameSecondaryAction: 'tickets.create_support_ticket_success_new_login.has_wallet.nameSecondaryAction',
    urlPrimaryAction: '/tabs/wallets',
    urlClose: '/profiles/menu',
  },
  create_ticket_no_wallet: {
    image: 'assets/img/support-ticket/create-ticket-success.svg',
    textPrimary: 'tickets.create_support_ticket_success_new_login.textPrimary',
    textSecondary: 'tickets.create_support_ticket_success_new_login.textSecondary',
    namePrimaryAction: 'tickets.create_support_ticket_success_new_login.no_wallet.namePrimaryAction',
    urlClose: '/support/options',
  },
};
