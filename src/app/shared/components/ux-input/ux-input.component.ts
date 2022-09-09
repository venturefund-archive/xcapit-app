import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard/clipboard.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-ux-input',
  template: `
    <div class="ux_input_container">
      <div class="ux_input_container__label">
        <ion-label class="ux-font-titulo-xs" color="primary">{{ this.label }} </ion-label>
        <ion-button
          *ngIf="this.infoIcon"
          class="ion-no-padding"
          slot="icon-only"
          fill="clear"
          appTrackClick
          name="ux_phrase_information"
          size="small"
          (click)="this.emitInfoClicked()"
        >
          <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
        </ion-button>
      </div>
      <ion-item class="ux_input_container__item ux-font-text-xs">
        <img class="ux_input_container__item__image" [src]="this.leftIcon" />
        <ion-input
          #inputRegister
          [ngClass]="{ 'google-place-input': this.type === 'google-places' }"
          [formControlName]="this.controlName"
          [type]="this.typeSetted"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
          [maxlength]="this.maxlength"
          [readonly]="this.readonly"
          [clearOnEdit]="false"
        ></ion-input>
        <ion-icon
          class="ux_input_container__item__error_icon"
          item-end
          *ngIf="!this.showNewPasswordErrors"
          [hidden]="!(this.control && this.control.invalid && this.control.touched)"
          name="ux-error"
          color="secondary"
          aria-hidden="“true”"
        ></ion-icon>
        <button
          [hidden]="!this.passwordType"
          [ngClass]="this.textClass" 
          item-end
          type="button"
          class="ux_input_container__item__eye_icon"
          (click)="this.togglePasswordMode()"
        >
          <ion-icon [name]="this.typeSetted === 'text' ? 'eye-outline' : 'eye-off-outline'"></ion-icon>
        </button>
        <ion-button
          appTrackClick
          name="Copy"
          [disabled]="!this.control.value"
          [hidden]="!this.copyType"
          type="button"
          class="ux_input_container__item__copy_icon"
          (click)="this.copyToClipboard()"
        >
          <img src="assets/img/nft-detail/copy.svg" />
        </ion-button>
        <ion-button
          [hidden]="!this.pasteType"
          name="Paste_Address"
          appTrackClick
          fill="clear"
          size="small"
          color="info"
          item-end
          type="button"
          (click)="this.pasteClipboardData()"
        >
          <ion-icon name="ux-paste"></ion-icon>
        </ion-button>
      </ion-item>
      <app-errors-form-item
        *ngIf="!this.showNewPasswordErrors"
        class="ux_input_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
      <app-errors-form-password-item
        *ngIf="this.showNewPasswordErrors"
        [control]="this.control"
        [errors]="this.errors"
      ></app-errors-form-password-item>
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
  @Input() leftIcon = '';
  @Input() showNewPasswordErrors = false;
  @Input() pasteType = false;
  @Input() textClass: string;
  @Input() infoIcon = false;
  @Output() infoIconClicked: EventEmitter<void> = new EventEmitter<void>();

  typeSetted: string;
  passwordType: boolean;
  @ViewChild('inputRegister', { read: ElementRef, static: true })
  input: ElementRef;

  control: AbstractControl;

  constructor(
    private formGroupDirective: FormGroupDirective,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.typeSetted = this.type === 'google-places' ? 'text' : this.type;
    this.passwordType = this.typeSetted === 'password';
    this.control = this.formGroupDirective.form.get(this.controlName);
  }

  copyToClipboard() {
    this.clipboardService.write({ url: this.control.value }).then(() => {
      this.showToast('shared.services.copy.toast_success');
    });
  }

  pasteClipboardData() {
    this.clipboardService.read().then((result) => {
      if (result.type === 'text/plain') {
        this.control.patchValue(result.value);
      }
    });
  }

  private showToast(text: string) {
    this.toastService.showInfoToast({
      message: this.translate.instant(text),
    });
  }

  togglePasswordMode() {
    this.typeSetted = this.typeSetted === 'text' ? 'password' : 'text';
    const nativeEl = this.input.nativeElement.querySelector('input');
    const inputSelection = nativeEl.selectionStart;
    nativeEl.focus();
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }

  emitInfoClicked(): void {
    this.infoIconClicked.emit();
  }
}