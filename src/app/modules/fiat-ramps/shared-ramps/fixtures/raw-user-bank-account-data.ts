export const rawCommonFieldsData = {
  data: [
    {
      type: 'Select',
      name_of_param: 'country',
      label: 'Pais',
      required: true,
      options: [
        {
          key: 'Argentina',
          value: 'ARG',
        },
        {
          key: 'Colombia',
          value: 'COL',
        },
        {
          key: 'Costa Rica',
          value: 'CRI',
        },
        {
          key: 'El Salvador',
          value: 'SLV',
        },
        {
          key: 'Uruguay',
          value: 'URY',
        },
        {
          key: 'Venezuela',
          value: 'VEN',
        },
      ],
    },
    {
      type: 'CurrenciesFiat',
      name_of_param: 'currency',
      label: 'Moneda',
      required: true,
    },
    {
      type: 'Input',
      name_of_param: 'name',
      label: 'Nombre entidad bancaria',
      required: true,
    },
    {
      type: 'Select',
      name_of_param: 'account_type',
      label: 'Tipo de cuenta',
      options: [
        {
          key: 'Ahorro',
          value: 'Ahorro',
        },
        {
          key: 'Corriente',
          value: 'Corriente',
        },
      ],
      required: true,
    },
    {
      type: 'Select',
      name_of_param: 'type_of_document',
      label: 'Tipo de documento',
      options: [
        {
          key: 'DNI',
          value: 'DNI',
        },
        {
          key: 'CUIT/CUIL',
          value: 'CUIT/CUIL',
        },
      ],
      required: true,
    },
    {
      type: 'Input',
      name_of_param: 'number_of_document',
      label: 'Identificacion',
      required: true,
    },
  ],
};

export const rawSpecificFieldsData = {
  data: [
    {
      type: 'Input',
      name_of_param: 'account_number',
      label: 'Numero de cuenta',
      required: true,
    },
  ],
};
