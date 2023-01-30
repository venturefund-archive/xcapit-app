export interface RawBitrefillOperation {
  event: string;
  invoiceId: string;
  paymentMethod: string;
  paymentUri: string;
}
