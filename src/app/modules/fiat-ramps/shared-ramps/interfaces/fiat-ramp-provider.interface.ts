export interface FiatRampProvider {
    id: number;
    alias: string;
    name: string;
    logoRoute: string;
    newOperationRoute: string;
}