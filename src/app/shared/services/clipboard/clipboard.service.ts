import { Injectable } from '@angular/core';
import { Plugins, ClipboardWrite } from '@capacitor/core';

const { Clipboard } = Plugins;

declare var navigator: any;

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  constructor() {}

  write(data: ClipboardWrite): Promise<void> {
    return Clipboard.write(data);
  }
}
