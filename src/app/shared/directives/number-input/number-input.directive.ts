import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberInput]',
})
export class NumberInputDirective {
  @Input() appNumberInput: string;

  constructor(private el: ElementRef) {}
  @HostListener('keypress', ['$event'])
  public onInput(event: any) {
    const inputEl = this.el.nativeElement.getElementsByTagName('input')[0];
    const inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);

    if (!this.pattern().test(inputEl.value + inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  pattern() {
    const patterns = { decimal: /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/, positiveInteger: /^\d{1,3}$/ };
    return this.appNumberInput ? patterns[this.appNumberInput] : patterns.decimal;
  }
}
