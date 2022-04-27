import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberInput]',
})
export class NumberInputDirective {
  @Input() appNumberInput = 'decimal';

  constructor(private el: ElementRef) {}
  @HostListener('keypress', ['$event'])
  public onInput(event: any) {
    let inputEl = this.el.nativeElement.getElementsByTagName('input')[0];
    let inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);
    const pattern = this.patterns()[this.appNumberInput];
    if (!pattern.test(inputEl.value + inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  patterns() {
    return { decimal: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/, positiveInteger: /^\d{1,3}$/ };
  }
}
