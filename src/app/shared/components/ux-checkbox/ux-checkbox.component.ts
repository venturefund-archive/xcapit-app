import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-ux-checkbox',
  template: `
    <div class="ux_checkbox_container">
      <ion-item class="ux_checkbox_container__item">
        <ion-label *ngIf="this.label" class="ux_checkbox_container__item__label {{ this.class }}">
          {{ this.label }}
        </ion-label>
        <ion-checkbox [formControlName]="this.controlName" [color]="this.color" [slot]="this.slot"></ion-checkbox>
      </ion-item>
    </div>
  `,
  styleUrls: ['./ux-checkbox.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxCheckboxComponent implements OnInit {
  @Input() label: string;
  @Input() slot: string;
  @Input() color: string;
  @Input() controlName: string;
  @Input() class: string;
  @Input() style: string;
  @ViewChild('inputRegister', { read: ElementRef, static: true })
  input: ElementRef;

  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
