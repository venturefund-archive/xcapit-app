export const AUTH = {
  storageKey: 'jwt',
  refreshKey: 'jwt_refresh',
  userKey: 'userLogged'
};
export const CONFIG = {
  app: {
    defaultLanguage: 'es'
  },
  loadingService: {
    defaultMessage: 'config.loading_service.default_message'
  },
  xhrResponseHandlerService: {
    defaultMessage: 'config.xhr_response_handler_service.default_message'
  },
  formErrors: [
    {
      name: 'required',
      text: 'config.form_errors.required',
      rules: []
    },
    {
      name: 'email',
      text: 'config.form_errors.email',
      rules: []
    },
    {
      name: 'pattern',
      text: 'config.form_errors.pattern',
      rules: []
    },
    {
      name: 'minlength',
      text: 'config.form_errors.minlength',
      rules: []
    },
    {
      name: 'maxlength',
      text: 'config.form_errors.maxlength',
      rules: []
    },
    {
      name: 'notMatching',
      text: 'config.form_errors.not_matching',
      rules: []
    }
  ],
  fieldErrors: {
    cellphone: [
      {
        name: 'pattern',
        text: 'config.field_errors.cellphone.pattern',
        rules: []
      }
    ],
    onlyIntegers: [
      {
        name: 'pattern',
        text: 'config.field_errors.only_integers.pattern',
        rules: []
      }
    ],
    password: [
      {
        name: 'minlength',
        text: 'config.field_errors.password.minlength',
        rules: []
      },
      {
        name: 'maxlength',
        text: 'config.field_errors.password.maxlength',
        rules: []
      },
      {
        name: 'hasNumber',
        text: 'config.field_errors.password.has_number',
        rules: []
      },
      {
        name: 'hasCapitalCase',
        text: 'config.field_errors.password.has_capital_case',
        rules: []
      },
      {
        name: 'hasSmallCase',
        text: 'config.field_errors.password.has_small_case',
        rules: []
      }
    ],
    repeatPassword: [
      {
        name: 'noPasswordMatch',
        text: 'config.field_errors.repeat_password.no_password_match',
        rules: []
      }
    ],
    repeatUsername: [
      {
        name: 'noFieldsMatch',
        text: 'config.field_errors.repeat_username.no_fields_match',
        rules: []
      }
    ],
    username: [
      {
        name: 'minlength',
        text: 'config.field_errors.username.minlength',
        rules: []
      },
      {
        name: 'maxlength',
        text: 'config.field_errors.username.maxlength',
        rules: []
      }
    ]
  },
  operationHistoryDates: {
    since: 'since',
    until: 'until'
  },
  chartRangeValues: {
    selected: 'selected'
  }
};
