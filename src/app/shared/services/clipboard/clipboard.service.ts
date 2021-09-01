import { Injectable } from '@angular/core';
import { Plugins, ClipboardWrite, ClipboardReadResult } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  clipboard = Plugins.Clipboard;

  constructor() {}

  public write(data: ClipboardWrite): Promise<void> {
    return this.clipboard.write(data);
  }

  public read(): Promise<ClipboardReadResult> {
    return this.clipboard.read();
  }
}
