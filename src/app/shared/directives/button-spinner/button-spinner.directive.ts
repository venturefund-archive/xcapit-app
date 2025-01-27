import { Directive, Input, ElementRef, HostBinding, OnChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'ion-button[appLoading]',
})
export class ButtonSpinnerDirective implements OnChanges, AfterViewInit {
  @Input() loadingText: string;
  @Input() spinnerColor = 'primary';
  @Input() appLoading: boolean;
  @Input() @HostBinding('disabled') disabled;

  private originalHTML: string;
  private spinnerHTML = `<ion-spinner style="margin-right: 10px" color="${this.spinnerColor}" name="crescent"></ion-spinner>`;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.saveOriginal();
  }

  ngOnChanges() {
    if (this.appLoading) {
      this.loadingStarted();
    } else if (this.originalHTML) {
      this.loadingFinished();
    }
  }

  private loadingFinished() {
    this.restoreOriginal();
    this.disabled = this.disabled ? true : false;
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
