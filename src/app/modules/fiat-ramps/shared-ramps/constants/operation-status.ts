import { OperationStatus } from "../interfaces/operation-status.interface";

export const OPERATION_STATUS: OperationStatus[] = [
    // Kripton
    {
        providerId: 1,
        name: 'complete',
        textToShow: 'deposited',
        colorCssClass: 'success'
    },
    {
        providerId: 1,
        name: 'cancel',
        textToShow: 'canceled',
        colorCssClass: 'danger'
    },
    {
        providerId: 1,
        name: 'pending_by_validate',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        providerId: 1,
        name: 'request',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        providerId: 1,
        name: 'received',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        providerId: 1,
        name: 'wait',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
];