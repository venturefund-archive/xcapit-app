import { Directive, Input, ElementRef, HostBinding, OnInit } from '@angular/core';

@Directive({
  selector: 'ion-button[loading]',
})
export class ButtonSpinnerDirective implements OnInit {
  @Input() loadingText: string;
  @HostBinding('disabled') disabled = false;

  private originalHTML: string;
  private spinnerHTML = '<ion-spinner name="crescent"></ion-spinner>';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.saveOriginal();
  }

  @Input()
  set loading(loading: boolean) {
    if (loading) {
      this.loadingStarted();
    } else if (this.originalHTML) {
      this.loadingFinished();
    }
  }

  private loadingFinished() {
    this.restoreOriginal();
    this.disabled = false;
  }

  private loadingStarted() {
    this.disabled = true;
    this.innerHTML = `${this.spinnerHTML} ${this.loadingText ?? this.originalHTML}`;
  }

  private saveOriginal() {
    this.originalHTML = this.innerHTML;
  }

  private restoreOriginal() {
    this.innerHTML = this.originalHTML;
  }

  private set innerHTML(aHTML: any) {
    this.el.nativeElement.innerHTML = aHTML;
  }

  private get innerHTML() {
    return this.el.nativeElement.innerHTML;
  }
}
