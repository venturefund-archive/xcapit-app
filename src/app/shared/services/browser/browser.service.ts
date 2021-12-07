import { Injectable } from '@angular/core';
import { Browser, OpenOptions } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  browser = Browser;
  private readonly defaultOptions = {
    toolbarColor: '#1c2d5e',
  };

  constructor() {}

  public open(options: OpenOptions): Promise<void> {
    return this.browser.open({ ...this.defaultOptions, ...options });
  }
}
