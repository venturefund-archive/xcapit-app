export const MODULES_CRYPTO = [
  {
    id: 1,
    open: 'yes',
    icon: 'assets/ux-icons/clip.svg',
    title: 'financial_education.home.module_crypto.module_1.title',
    disabled: false,
    last: false,
    sub_modules: [
      {
        id: 1,
        link: '',
        title: 'financial_education.home.module_crypto.module_1.sub_modules.sub_module_1',
        dataToTrack:'what_is_blockchain',
        screenViewLabel: 'ux_education_screenview_intro_block_complete',
        last: true,
      },
    ],
  },
  {
    id:2,
    icon: 'assets/ux-icons/money.svg',
    title: 'financial_education.home.module_crypto.module_2.title',
    comingSoon: true,
    disabled: true,
    last: false,
  },
  {
    id:3,
    icon: 'assets/ux-icons/briefcase.svg',
    title: 'financial_education.home.module_crypto.module_3.title',
    comingSoon: true,
    disabled: true,
    last: true,
  },
];
