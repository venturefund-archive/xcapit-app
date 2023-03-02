export interface TokenOperationData {
    asset?: string,
    network?: string,
    country?: string,
    mode?: 'buy' | 'sell',
    isFirstTime?: boolean,
}