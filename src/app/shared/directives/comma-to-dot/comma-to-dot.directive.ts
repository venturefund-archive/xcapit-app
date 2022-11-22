import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCommaToDot]',
})
export class CommaToDotDirective {
  constructor(private el: ElementRef) {}
  @HostListener('keyup')
  public onInput() {
    if (this._stringValue()) this._replaceCommaPerDot();
  }

  private _replaceCommaPerDot() {
    this._nativeElement().value = this._nativeElement().value.replace(',', '.');
  }

  private _stringValue() {
    return typeof this._nativeElement().value === 'string';
  }

  private _nativeElement() {
    return this.el.nativeElement as HTMLInputElement;
  }
}
