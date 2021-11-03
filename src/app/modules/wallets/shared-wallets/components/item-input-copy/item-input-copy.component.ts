import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-item-input-copy',
  template: ` <div class="ux_input_copy_container">
    <ion-label class="ux_input_copy_container__label ux-font-text-xs">{{ this.label | translate }}</ion-label>
    <ion-item class="ux_input_copy_container__item ux-font-text-base">
      <img
        class="ux_input_copy_container__image"
        [src]="this.typeBlockchain === true ? 'assets/img/prueba/polygon.svg' : ''"
      />
      <ion-input [value]="this.dataInput"></ion-input>
      <button
        *ngIf="!this.typeBlockchain"
        item-end
        type="button"
        class="ux_input_copy_container__item__copy_icon"
        (click)="this.copyToClipboard()"
      >
        <img src="assets/img/prueba/copy.svg" />
      </button>
    </ion-item>
  </div>`,
  styleUrls: ['./item-input-copy.component.scss'],
})
export class ItemInputCopyComponent implements OnInit {
  @Input() dataInput = '';
  @Input() label;
  @Input() typeBlockchain = false;

  form: FormGroup = this.formBuilder.group({
    data: [''],
  });

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.setFormValue(this.dataInput);
  }

  setFormValue(dataInput: string) {
    this.form.patchValue({ data: dataInput });
  }

  copyToClipboard() {
    this.clipboardService.write({ url: this.dataInput }).then(
      () => {
        this.showToast('SEEEEEEEEEE');
      },
      () => {
        this.showToast('ERROR');
      }
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }
}
