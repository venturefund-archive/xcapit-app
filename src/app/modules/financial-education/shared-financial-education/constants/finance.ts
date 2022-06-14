export const MODULES_FINANCE = [
  {
    name: 'finance_1',
    open: 'yes',
    icon: 'assets/ux-icons/introduction-finances.svg',
    title: 'financial_education.home.module_finance.module_1.title',
    progress_title: 'financial_education.home.module_finance.module_1.progress_title',
    disabled: false,
    done: true,
    last: false,
    sub_modules: [
      {
        name: 'finance_sub_1',
        title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.title',
        info: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.description',
        img: 'assets/img/financial-education/startied.svg',
        dataToTrack: 'how_to_get_started_in_finance',
        learning_code: 'dVKXJqBs',
        test_code: 'GGLKURh6',
        last: false,
      },
      {
        name: 'finance_sub_2',
        title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_2.title',
        info: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_2.description',
        img: 'assets/img/financial-education/manage-money.svg',
        dataToTrack: 'budgets',
        learning_code: 'FNFBi9Lb',
        test_code: 'PesYFNQ5',
        last: false,
      },
    ],
  },
  {
    name: 'finance_2',
    icon: 'assets/ux-icons/quote.svg',
    title: 'financial_education.home.module_finance.module_2.title',
    description: 'financial_education.home.module_finance.module_2.description',
    comingSoon: true,
    disabled: true,
    last: false,
  },
  {
    name: 'finance_3',
    icon: 'assets/ux-icons/invest.svg',
    title: 'financial_education.home.module_finance.module_3.title',
    description: 'financial_education.home.module_finance.module_3.description',
    comingSoon: true,
    disabled: true,
    last: true,
  },
];
