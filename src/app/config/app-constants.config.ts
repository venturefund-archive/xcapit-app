export const API_URL = 'http://localhost:9050/api';
export const AUTH = {
  storageKey: 'jwt',
  userKey: 'userLogged'
};
export const CONFIG = {
  app: {
    mainTitle: '',
    welcomeMsg: {
      title: '',
      message: ''
    }
  },
  auth: {
    sessionExpired: {
      message: ''
    }
  },
  successMessages: {},
  actionSheet: {
    buttons: {}
  },
  errors: {
    auth: {
      title: '',
      message: ``
    }
  },
  formErrors: [
    {
      name: 'required',
      text: 'El campo es requerido',
      rules: []
    },
    {
      name: 'email',
      text: 'El email no es correcto',
      rules: []
    },
    {
      name: 'pattern',
      text: 'El campo no cumple con el patrón requerido',
      rules: []
    },
    {
      name: 'minlength',
      text: 'Se requieren más caracteres',
      rules: []
    },
    {
      name: 'maxlength',
      text: 'Se requieren menos caracteres',
      rules: []
    },
    {
      name: 'notMatching',
      text: 'Los campos no coinciden',
      rules: []
    }
  ],
  fieldErrors: {
    cellphone: [
      {
        name: 'pattern',
        text: 'Contiene caracteres inválidos',
        rules: []
      }
    ],
    onlyIntegers: [
      {
        name: 'pattern',
        text: 'Solo se aceptan números enteros',
        rules: []
      }
    ],
    password: [
      {
        name: 'minlength',
        text: 'Se requieren mínimo 6 caracteres',
        rules: []
      },
      {
        name: 'maxlength',
        text: 'Se requieren máximo 100 caracteres',
        rules: []
      },
      {
        name: 'hasNumber',
        text: 'Se requiere mínimo un número',
        rules: []
      },
      {
        name: 'hasCapitalCase',
        text: 'Se requiere mínimo una mayúscula',
        rules: []
      },
      {
        name: 'hasSmallCase',
        text: 'Se requiere mínimo una minúscula',
        rules: []
      }
    ],
    repeatPassword: [
      {
        name: 'noPasswordMatch',
        text: 'La password no coincide',
        rules: []
      }
    ],
    repeatUsername: [
      {
        name: 'noFieldsMatch',
        text: 'El email no coincide',
        rules: []
      }
    ],
    username: [
      {
        name: 'minlength',
        text: 'Se requieren mínimo 5 caracteres',
        rules: []
      },
      {
        name: 'maxlength',
        text: 'Se requieren máximo 100 caracteres',
        rules: []
      }
    ]
  }
};
