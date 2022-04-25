import { FiatRampProvider } from "./fiat-ramp-provider.interface";

export interface OperationStatus {
    provider: FiatRampProvider;
    name: string;
    textToShow: string;
    colorCssClass: string;
}