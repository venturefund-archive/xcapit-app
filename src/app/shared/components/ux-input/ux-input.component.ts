import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard/clipboard.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-ux-input',
  template: `
    <div class="ux_input_container">
      <ion-label class="ux-font-input-label">{{ this.label | translate }}</ion-label>
      <ion-item class="ux_input_container__item ux-font-text-xs">
        <img class="ux_input_container__item__image" [src]="this.blockchainImage" />
        <ion-input
          #inputRegister
          [ngClass]="{ 'google-place-input': this.type === 'google-places' }"
          [formControlName]="this.controlName"
          [type]="this.typeSetted"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
          [maxlength]="this.maxlength"
          [readonly]="this.readonly"
        ></ion-input>

        <ion-icon
          class="ux_input_container__item__error_icon"
          item-end
          [hidden]="!(this.control && this.control.invalid && this.control.touched)"
          name="ux-error"
          color="uxsecondary"
          aria-hidden="“true”"
        ></ion-icon>
        <button
          [hidden]="!this.passwordType"
          item-end
          type="button"
          class="ux_input_container__item__eye_icon"
          (click)="this.togglePasswordMode()"
        >
          <ion-icon [name]="this.typeSetted === 'text' ? 'eye' : 'eye-off'"></ion-icon>
        </button>
        <ion-button
          appTrackClick
          name="Copy"
          [disabled]="!this.control.value"
          [hidden]="!this.copyType"
          item-end
          type="button"
          class="ux_input_container__item__copy_icon"
          (click)="this.copyToClipboard()"
        >
          <img src="assets/img/prueba/copy.svg" />
        </ion-button>
      </ion-item>
      <app-errors-form-item
        class="ux_input_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
    </div>
  `,
  styleUrls: ['./ux-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxInputComponent implements OnInit {
  @Input() label: string;
  @Input() inputmode: string;
  @Input() type: string;
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() maxlength: any;
  @Input() readonly = false;
  @Input() copyType = false;
  @Input() blockchainImage = '';

  typeSetted: string;
  passwordType: boolean;
  @ViewChild('inputRegister', { read: ElementRef, static: true })
  input: ElementRef;

  control: AbstractControl;

  constructor(
    private form: FormGroupDirective,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.typeSetted = this.type === 'google-places' ? 'text' : this.type;
    this.passwordType = this.typeSetted === 'password';
    this.control = this.form.control.get(this.controlName);
  }

  copyToClipboard() {
    console.log(this.control.value);
    this.clipboardService.write({ url: this.control.value }).then(() => {
      this.showToast('shared.services.copy.toast_success');
    });
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }

  togglePasswordMode() {
    // cambiar tipo input
    this.typeSetted = this.typeSetted === 'text' ? 'password' : 'text';
    // obtener el input
    const nativeEl = this.input.nativeElement.querySelector('input');
    // obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    // ejecuto el focus al input
    nativeEl.focus();
    // espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }
}
