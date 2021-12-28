import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-custom-stop-loss-setting',
  template: `
    <div class="cslm ion-padding-start ion-padding-end">
      <div class="ux-font-text-xs title">
        <ion-text *ngIf="this.typeModal === this.types.sl">{{ this.typeModal.title }}</ion-text>
      </div>
      <div class="ux-font-text-xs message">
        <ion-text *ngIf="this.typeModal === this.types.sl">{{ this.typeModal.message }}</ion-text>
      </div>
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="cslm__input-error">
          <div class="cslm__input">
            <ion-input type="number" formControlName="valueSL"></ion-input>
          </div>
          <app-errors-form-item [controlName]="'valueSL'"></app-errors-form-item>
        </div>
        <div class="cslm__buttons">
          <ion-button
            class="text-button-secondary"
            appTrackClick
            name="Cancel"
            type="button"
            fill="clear"
            (click)="closeModal()"
          >
            {{ 'funds.custom_range_component.cancel_button' | translate }}
          </ion-button>
          <ion-button
            class="text-button-primary"
            appTrackClick
            name="Confirm"
            type="submit"
            fill="clear"
            [disabled]="!this.form.valid || (this.submitButtonService.isDisabled | async)"
          >
            {{ 'funds.custom_range_component.confirm_button' | translate }}
          </ion-button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./custom-stop-loss-setting.component.scss'],
})
export class CustomStopLossSettingComponent implements OnInit {
  @Input() title;
  @Input() message;
  @Input() type;
  @Input() stopLoss;
  @Input() trailingStop;
  valueSL: number;
  typeModal;
  form: FormGroup = this.formBuilder.group({
    valueSL: [25, [Validators.required, Validators.pattern('[0-9][^.a-zA-Z]*$'), Validators.min(3)]],
  });

  types = {
    sl: {
      title: '',
      message: '',
    },
  };
  constructor(
    public submitButtonService: SubmitButtonService,
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  handleSubmit() {
    if (this.form.valid) {
      this.modalController.dismiss(this.form.value.valueSL, 'valueSL');
    }
  }

  ngOnInit() {
    this.getTypeModal();
    this.setModalValues();
    if (
      (this.type === 'classicSL' && this.trailingStop) ||
      (this.type === 'classicSL' && this.stopLoss === 100) ||
      (this.type === 'inteligentSL' && !this.trailingStop)
    ) {
      this.form.patchValue({ valueSL: 25 });
    } else {
      this.form.patchValue({ valueSL: this.stopLoss });
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getTypeModal() {
    return (this.typeModal = this.types.sl);
  }

  setModalValues() {
    this.typeModal.title = this.title;
    this.typeModal.message = this.message;
  }
}
