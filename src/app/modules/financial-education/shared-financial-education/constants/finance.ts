export const MODULES_FINANCE = [
  {
    open: 'yes',
    icon: 'assets/ux-icons/introduction-finances.svg',
    title: 'financial_education.home.module_finance.module_1.title',
    disabled: false,
    last: false,
    sub_modules: [
      {
        link: '',
        title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1',
        dataToTrack:'how_to_get_started_in_finance',
        last: false,
      },
      {
        link: '',
        title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_2',
        dataToTrack:'budgets',
        last: false,
      },
    ],
  },
  {
    icon: 'assets/ux-icons/quote.svg',
    title: 'financial_education.home.module_finance.module_2.title',
    description: 'financial_education.home.module_finance.module_2.description',
    comingSoon: true,
    disabled: true,
    last: false,
  },
  {
    icon: 'assets/ux-icons/invest.svg',
    title: 'financial_education.home.module_finance.module_3.title',
    description: 'financial_education.home.module_finance.module_3.description',
    comingSoon: true,
    disabled: true,
    last: true,
  },
];
