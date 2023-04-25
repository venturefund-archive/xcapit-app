import { OperationStatus } from '../interfaces/operation-status.interface';

export const OPERATION_STATUS: { type: string; statuses: OperationStatus[] }[] = [
  {
    type: 'cash-in',
    statuses: [
      {
        providerId: 1,
        name: 'complete',
        textToShow: 'confirmed',
        colorCssClass: 'success',
      },
      {
        providerId: 1,
        name: 'refund',
        textToShow: 'nullified',
        colorCssClass: 'danger',
        icon: 'assets/img/wallets/error-circle.svg',
      },
      {
        providerId: 1,
        name: 'cancel',
        textToShow: 'cancelled',
        colorCssClass: 'danger',
        icon: 'assets/img/wallets/error-circle.svg',
      },
      {
        providerId: 1,
        name: 'pending_by_validate',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'request',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'received',
        textToShow: 'in_progress',
        colorCssClass: 'info',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'wait',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
    ],
  },
  {
    type: 'cash-out',
    statuses: [
      {
        providerId: 1,
        name: 'complete',
        textToShow: 'confirmed',
        colorCssClass: 'success',
      },
      {
        providerId: 1,
        name: 'refund',
        textToShow: 'nullified',
        colorCssClass: 'danger',
        icon: 'assets/img/wallets/error-circle.svg',
      },
      {
        providerId: 1,
        name: 'cancel',
        textToShow: 'cancelled',
        colorCssClass: 'danger',
        icon: 'assets/img/wallets/error-circle.svg',
      },
      {
        providerId: 1,
        name: 'pending_by_validate',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'request',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'received',
        textToShow: 'in_progress',
        colorCssClass: 'info',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
      {
        providerId: 1,
        name: 'wait',
        textToShow: 'incomplete',
        colorCssClass: 'warning',
        icon: 'assets/img/wallets/warning-circle.svg',
      },
    ],
  },
];
