import { OperationStatus } from "../interfaces/operation-status.interface";
import { PROVIDERS } from "./providers";

export const OPERATION_STATUS: OperationStatus[] = [
    // Kripton
    {
        provider: PROVIDERS[0],
        name: 'complete',
        textToShow: 'deposited',
        colorCssClass: 'success'
    },
    {
        provider: PROVIDERS[0],
        name: 'cancel',
        textToShow: 'canceled',
        colorCssClass: 'danger'
    },
    {
        provider: PROVIDERS[0],
        name: 'pending_by_validate',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        provider: PROVIDERS[0],
        name: 'request',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        provider: PROVIDERS[0],
        name: 'received',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
    {
        provider: PROVIDERS[0],
        name: 'wait',
        textToShow: 'in_progress',
        colorCssClass: 'warning'
    },
];