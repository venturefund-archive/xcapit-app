import { RawBitrefillOperation } from '../interfaces/raw-bitrefill-operation.interface';

export const nativeEventPayment =
  '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "ethereum","paymentUri":"ethereum:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';
export const nonNativeEventPayment =
  '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "usdc_polygon","paymentUri":"ethereum:0x2791bca1f2de4661ed88a30c99a7a9449aa84174@137/transfer?address=0xD148C6735e1777BE439519B32A1a6Ef9c8853945&uint256=5.8e5"}';
export const nativeNonValidEventPayment =
  '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "bitcoin","paymentUri":"bitcoin:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';

export const nativeEventInvoice =
  '{"event":"invoice_created", "invoiceId": "123-456-789-012","paymentMethod": "ethereum","paymentUri":"ethereum:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';
export const nonNativeEventInvoice =
  '{"event":"invoice_created", "invoiceId": "123-456-789-012","paymentMethod": "usdc_polygon","paymentUri":"ethereum:0x2791bca1f2de4661ed88a30c99a7a9449aa84174@137/transfer?address=0xD148C6735e1777BE439519B32A1a6Ef9c8853945&uint256=5.8e5"}';
export const nativeNonValidEventInvoice =
  '{"event":"invoice_created", "invoiceId": "123-456-789-012","paymentMethod": "bitcoin","paymentUri":"bitcoin:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';

export const rawNativeEvent: RawBitrefillOperation = JSON.parse(nativeEventPayment);
export const rawNonNativeEvent: RawBitrefillOperation = JSON.parse(nonNativeEventPayment);
export const rawNativeNonValidTokenEvent: RawBitrefillOperation = JSON.parse(nativeNonValidEventPayment);

export const rawNativeEventInvoice: RawBitrefillOperation = JSON.parse(nativeEventInvoice);
export const rawNonNativeEventInvoice: RawBitrefillOperation = JSON.parse(nonNativeEventInvoice);
export const rawNativeNonValidTokenEventInvoice: RawBitrefillOperation = JSON.parse(nativeNonValidEventInvoice);
