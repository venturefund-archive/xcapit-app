import { RawBitrefillOperation } from '../interfaces/raw-bitrefill-operation.interface';

export const nativeEventPayment =
  '{"event":"payment_intent","invoiceId":"83a65332-6d70-4ef2-85c2-1002cde24060","paymentUri":"ethereum:0x58A7311cB3ce28DF2Eb5304128F7038e90F636d4?amount=0.025737","paymentMethod":"ethereum"}';
export const nonNativeEventPayment =
  '{"event":"payment_intent","invoiceId":"db0f152c-fd72-4d68-b1c7-0612190afab4","paymentUri":"ethereum:0x2FcA4930b3B59338bc57b9196eEae196e6A4Da42?amount=41.05","paymentMethod":"usdc_polygon"}';
export const nativeNonValidEventPayment =
  '{"event":"payment_intent","invoiceId":"db0f152c-fd72-4d68-b1c7-0612190afab4","paymentUri":"bitcoin:0x2FcA4930b3B59338bc57b9196eEae196e6A4Da42?amount=41.05","paymentMethod":"bitcoin"}';

export const nativeEventInvoice =
  '{"event":"invoice_created","invoiceId":"83a65332-6d70-4ef2-85c2-1002cde24060","paymentUri":"ethereum:0x58A7311cB3ce28DF2Eb5304128F7038e90F636d4?amount=0.025737","paymentMethod":"ethereum"}';
export const nonNativeEventInvoice =
  '{"event":"invoice_created","invoiceId":"db0f152c-fd72-4d68-b1c7-0612190afab4","paymentUri":"ethereum:0x2FcA4930b3B59338bc57b9196eEae196e6A4Da42?amount=41.05","paymentMethod":"usdc_polygon"}';
  export const nativeNonValidEventInvoice =
  '{"event":"invoice_created","invoiceId":"db0f152c-fd72-4d68-b1c7-0612190afab4","paymentUri":"bitcoin:0x2FcA4930b3B59338bc57b9196eEae196e6A4Da42?amount=41.05","paymentMethod":"bitcoin"}';

export const rawNativeEvent: RawBitrefillOperation = JSON.parse(nativeEventPayment);
export const rawNonNativeEvent: RawBitrefillOperation = JSON.parse(nonNativeEventPayment);
export const rawNativeNonValidTokenEvent: RawBitrefillOperation = JSON.parse(nativeNonValidEventPayment);

export const rawNativeEventInvoice: RawBitrefillOperation = JSON.parse(nativeEventInvoice);
export const rawNonNativeEventInvoice: RawBitrefillOperation = JSON.parse(nonNativeEventInvoice);
export const rawNativeNonValidTokenEventInvoice: RawBitrefillOperation = JSON.parse(nativeNonValidEventInvoice);
