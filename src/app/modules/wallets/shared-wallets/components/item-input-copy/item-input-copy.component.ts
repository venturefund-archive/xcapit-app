import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-item-input-copy',
  template: ` <div class="ic">
    <ion-label class="ic__label ux-font-text-xs">{{ this.label | translate }}</ion-label>
    <ion-item class="ic__item ux-font-text-base">
      <img class="ic__image" [src]="this.typeBlockchain === true ? 'assets/img/prueba/polygon.svg' : ''" />
      <ion-input [value]="this.dataInput" readonly="true"></ion-input>
      <ion-button
        appTrackClick
        name="Copy"
        *ngIf="!this.typeBlockchain"
        item-end
        type="button"
        class="ic__item__copy_icon"
        (click)="this.copyToClipboard()"
      >
        <img src="assets/img/prueba/copy.svg" />
      </ion-button>
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
        this.showToast('shared.services.copy.toast_success');
      },
      () => {
        this.showToast('shared.services.copy.toast_error');
      }
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }
}
