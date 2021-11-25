import { Injectable } from '@angular/core';
import { ReadResult, WriteOptions } from '@capacitor/clipboard';
import { Clipboard } from '@capacitor/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  clipboard = Clipboard;

  constructor() {}

  public write(data: WriteOptions): Promise<void> {
    return this.clipboard.write(data);
  }

  public read(): Promise<ReadResult> {
    return this.clipboard.read();
  }
}
