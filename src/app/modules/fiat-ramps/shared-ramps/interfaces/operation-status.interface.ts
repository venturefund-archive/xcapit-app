import { FiatRampProvider } from "./fiat-ramp-provider.interface";

export interface OperationStatus {
    provider?: FiatRampProvider;
    providerId: number;
    name: string;
    textToShow: string;
    colorCssClass: string;
}