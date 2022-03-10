import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-filter-tab',
  template: `
    <ion-segment class="dt" scrollable [formControlName]="this.controlName">
      <ion-segment-button
        *ngFor="let item of items; let i = index"
        class="button"
        [value]="item.value"
        [id]="item.value"
      >
        <ion-label class="ux-font-text-xs">
          {{ this.item.title | translate }}
        </ion-label>
      </ion-segment-button>
    </ion-segment>
  `,
  styleUrls: ['./filter-tab.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FilterTabComponent implements AfterViewInit {
  control: AbstractControl;
  @Input() items: { title: string; value: string }[];
  @Input() controlName: string;
  constructor(private formGroupDirective: FormGroupDirective, public elRef: ElementRef) {}

 
  ngAfterViewInit() {
    this.getControl();
    this.subscribeOnChanges();
    this.scrollOnInit();
  }
  
  scrollOnInit(){
    setTimeout(() => {    
      this.scrollToElement(this.control.value);
    }, 200);
  }

  getControl(){
    this.control = this.formGroupDirective.form.get(this.controlName);
  }

  subscribeOnChanges() {
    this.control.valueChanges.subscribe((value) => this.scrollToElement(value));
  }

  scrollToElement(value: string) {
    this.elRef.nativeElement.querySelector(`ion-segment-button[id=${value}]`).scrollIntoView({
      behavior:'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }
}
