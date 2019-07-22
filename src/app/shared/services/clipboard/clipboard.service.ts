import { Injectable } from '@angular/core';

declare var navigator: any;

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private copyStrategy: any;

  constructor() {
    this.setStrategy();
  }

  copy(text: string): Promise<void> {
    return this.copyStrategy(text);
  }

  setStrategy(strategy: any = null): void {
    if (strategy) {
      this.copyStrategy = strategy;
    } else {
      this.copyStrategy = navigator.clipboard ?
        this.clipboardCopy : this.execCommandCopy;
    }
  }

  private clipboardCopy(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  private execCommandCopy(text: string): Promise<string | boolean> {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    let result: Promise<string | boolean>;
    try {
      const successful = document.execCommand('copy');
      result = Promise.resolve(successful);
    } catch (err) {
      result = Promise.reject('Oops, unable to copy');
    } finally {
      document.body.removeChild(textArea);
    }
    return result;
  }
}
