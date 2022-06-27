export const AUTH = {
  storageKey: 'jwt',
  refreshKey: 'jwt_refresh',
  userKey: 'userLogged',
};
export const CONFIG = {
  app: {
    defaultLanguage: 'es',
    statusBarColor: '#1c2d5e',
    storageVersionKey: 'appVersion',
  },
  loadingService: {
    defaultMessage: 'config.loading_service.default_message',
  },
  xhrResponseHandlerService: {
    defaultMessage: 'config.xhr_response_handler_service.default_message',
  },
  formErrors: [
    {
      name: 'required',
      text: 'config.form_errors.required',
      rules: [],
    },
    {
      name: 'isNotInRange',
      text: 'config.form_errors.isNotInRange',
      rules: [],
    },
    {
      name: 'email',
      text: 'config.form_errors.email',
      rules: [],
    },
    {
      name: 'pattern',
      text: 'config.form_errors.pattern',
      rules: [],
    },
    {
      name: 'minlength',
      text: 'config.form_errors.minlength',
      rules: [],
    },
    {
      name: 'maxlength',
      text: 'config.form_errors.maxlength',
      rules: [],
    },
    {
      name: 'notMatching',
      text: 'config.form_errors.not_matching',
      rules: [],
    },
    {
      name: 'hasSpecialCharacter',
      text: 'config.form_errors.has_special_character',
      rules: [],
    },
    {
      name: 'countWordsMatch',
      text: 'config.form_errors.count_words_match',
      rules: [],
    },
    {
      name: 'min',
      text: 'config.form_errors.min',
      rules: [],
    },
  ],
  fieldErrors: {
    cellphone: [
      {
        name: 'pattern',
        text: 'config.field_errors.cellphone.pattern',
        rules: [],
      },
    ],
    onlyIntegers: [
      {
        name: 'pattern',
        text: 'config.field_errors.only_integers.pattern',
        rules: [],
      },
    ],
    password: [
      {
        name: 'minlength',
        text: 'config.field_errors.password.minlength',
        rules: [],
      },
      {
        name: 'maxlength',
        text: 'config.field_errors.password.maxlength',
        rules: [],
      },
      {
        name: 'hasNumber',
        text: 'config.field_errors.password.has_number',
        rules: [],
      },
      {
        name: 'hasCapitalCase',
        text: 'config.field_errors.password.has_capital_case',
        rules: [],
      },
      {
        name: 'hasSmallCase',
        text: 'config.field_errors.password.has_small_case',
        rules: [],
      },
    ],
    createWalletPassword: [
      {
        name: 'minlength',
        text: 'config.field_errors.create_wallet_password.minlength',
        rules: [],
      },
      {
        name: 'notAlphanumeric',
        text: 'config.field_errors.create_wallet_password.not_alphanumeric',
        rules: [],
      },
      {
        name: 'hasCapitalAndSmallCase',
        text: 'config.field_errors.create_wallet_password.has_capital_and_small_case',
        rules: [],
      },
    ],
    recoverWalletPhrase: [
      {
        name: 'twelveWords',
        text: 'config.field_errors.import_wallet_phrase.twelve_words',
        rules: [],
      },
      {
        name: 'spaceBetween',
        text: 'config.field_errors.import_wallet_phrase.space_between',
        rules: [],
      },
      {
        name: 'hasSpecialCharacter',
        text: 'config.field_errors.import_wallet_phrase.no_special_characters',
        rules: [],
      }
    ],
    oldPassword: [
      {
        name: 'walletIncorrectPassword',
        text: 'config.field_errors.old_password.wallet_incorrect_password',
        rules: [],
      },
    ],
    repeatPassword: [
      {
        name: 'noPasswordMatch',
        text: 'config.field_errors.repeat_password.no_password_match',
        rules: [],
      },
    ],
    repeatUsername: [
      {
        name: 'noFieldsMatch',
        text: 'config.field_errors.repeat_username.no_fields_match',
        rules: [],
      },
    ],
    newPassword: [
      {
        name: 'newPasswordMatchesOld',
        text: 'config.field_errors.new_password.new_password_matches_old',
        rules: [],
      },
    ],
    username: [
      {
        name: 'minlength',
        text: 'config.field_errors.username.minlength',
        rules: [],
      },
      {
        name: 'maxlength',
        text: 'config.field_errors.username.maxlength',
        rules: [],
      },
    ],
  },
  operationHistoryDates: {
    since: 'since',
    until: 'until',
  },
  chartRangeValues: {
    selected: 'selected',
  },
  cache: {
    TTL: 3600,
    PREFIX: '_cache_',
  },
};
