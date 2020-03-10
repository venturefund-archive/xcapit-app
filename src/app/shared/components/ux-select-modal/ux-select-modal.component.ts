import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonRadioGroup } from '@ionic/angular';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-ux-select-modal',
  template: `
    <div class="sm__header">
      <ion-text
        class="sm__header__text ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
      >
        {{ this.title }}
      </ion-text>
      <ion-button
        appTrackClick
        name="Close"
        (click)="this.close()"
        fill="clear"
        size="small"
        color="uxsemidark"
        class="sm__header__close"
      >
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </div>
    <ion-content class="sm__content ion-padding-start ion-padding-end">
      <form [formGroup]="this.form">
        <app-ux-radio-group>
          <ion-list>
            <ion-radio-group
              (ionChange)="this.select($event)"
              formControlName="radio"
            >
              <ion-item *ngFor="let item of this.data">
                <ion-label>{{
                  this.rawData ? item : item[this.keyName]
                }}</ion-label>
                <ion-radio
                  mode="md"
                  slot="start"
                  [value]="this.rawData ? item : item[this.valueName]"
                ></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        </app-ux-radio-group>
      </form>
    </ion-content>
  `,
  styleUrls: ['./ux-select-modal.component.scss']
})
export class UxSelectModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  title = '';
  data = [];
  keyName = '';
  valueName = '';
  rawData = false;
  selected: any;
  form: FormGroup = this.formBuilder.group({
    radio: ['', []]
  });

  ngOnInit() {
    this.rawData = this.keyName === '' && this.valueName === '' ? true : false;
    this.setSelected();
  }

  setSelected() {
    this.form.patchValue({
      radio: this.selected
    });
  }

  select(event: any) {
    this.modalController.dismiss(event.detail.value, 'selected');
  }

  close() {
    this.modalController.dismiss();
  }
}
