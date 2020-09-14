import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-range-modal',
  template: `
    <div class="crm ion-padding-start ion-padding-end">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="crm__input">
          <app-ux-range min="5" max="50" minText="%" maxText="%" controlName="selected">
            <ion-range
              mode="md"
              min="5"
              max="50"
              step="5"
              ticks="true"
              formControlName="selected"
            ></ion-range
          ></app-ux-range>
        </div>
        <div class="crm__buttons">
          <ion-button
            class="ux_button crm__buttons__cancel"
            appTrackClick
            name="Cancel"
            type="button"
            fill="clear"
            (click)="closeModal()"
          >
            {{ 'funds.custom_range_component.cancel_button' | translate }}
          </ion-button>
          <ion-button
            [disabled]="!this.form.valid"
            class="ux_button"
            appTrackClick
            name="Confirm"
            type="submit"
            color="uxsecondary"
            fill="clear"
          >
            {{ 'funds.custom_range_component.confirm_button' | translate }}
          </ion-button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./custom-range-modal.component.scss']
})
export class CustomRangeModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}
  selected: string;


  form: FormGroup = this.formBuilder.group({
    selected: [5, [Validators.required]]
  });

  handleSubmit() {
    if (this.form.valid) {
      this.modalController.dismiss(this.form.value.selected, 'selected');
    }
  }

  ngOnInit() {
    if (this.selected) {
      this.form.patchValue({ selected: this.selected });
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
