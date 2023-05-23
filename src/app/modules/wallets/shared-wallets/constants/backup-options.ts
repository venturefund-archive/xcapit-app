export const BACKUP_OPTIONS = [
  {
    action: true,
    order: '1',
    title: 'wallets.success_creation.backup_options.option_2.title',
    subtitle: 'wallets.success_creation.backup_options.option_2.subtitle',
    name: 'ux_bkupgdrive_start',
    disabled: false,
    completed: false,
    disable: 'ff_disableGDriveBackup'
  },
  {
    action: false,
    order: '2',
    title: 'wallets.success_creation.backup_options.option_1.title',
    subtitle: 'wallets.success_creation.backup_options.option_1.subtitle',
    url: '/wallets/recovery/read',
    name: 'ux_go_to_protect',
    disabled: true,
    completed: false,
  }
];
