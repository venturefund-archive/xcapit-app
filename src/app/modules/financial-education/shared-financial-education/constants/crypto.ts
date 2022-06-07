export const MODULES_CRYPTO = [
  {
    name: 'crypto_1',
    open: 'yes',
    icon: 'assets/ux-icons/clip.svg',
    title: 'financial_education.home.module_crypto.module_1.title',
    disabled: false,
    last: false,
    sub_modules: [
      {
        name: '1',
        title: 'financial_education.home.module_crypto.module_1.sub_modules.sub_module_1.title',
        info: 'financial_education.home.module_crypto.module_1.sub_modules.sub_module_1.description',
        img: 'assets/img/financial-education/maitenance.svg',
        dataToTrack: 'what_is_blockchain',
        learning_code: 'mod1-blockchain',
        test_code: 'rM313f0w',
        last: true,
      },
    ],
  },
  {
    name: 'crypto_2',
    icon: 'assets/ux-icons/money.svg',
    title: 'financial_education.home.module_crypto.module_2.title',
    comingSoon: true,
    disabled: true,
    last: false,
  },
  {
    name: 'crypto_3',
    icon: 'assets/ux-icons/briefcase.svg',
    title: 'financial_education.home.module_crypto.module_3.title',
    comingSoon: true,
    disabled: true,
    last: true,
  },
];
