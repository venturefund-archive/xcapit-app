import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class QRCodeService {
  qrCode = QRCode;
  constructor() {}

  generateQRFromText(text: string): Promise<string> {
    return this.qrCode.toDataURL(text);
  }
}
