import { Component, OnInit } from '@angular/core';
import { ModalController, IonRadioGroup } from '@ionic/angular';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-modal-new',
  template: `
    <div class="sm__header">
      <ion-text class="sm__header__text ux-font-text-xl">
        {{ this.title }}
      </ion-text>
      <ion-button
        appTrackClick
        name="Close"
        [dataToTrack]="{ description: this.title }"
        (click)="this.close()"
        fill="clear"
        size="small"
        color="uxsemidark"
        class="sm__header__close"
      >
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </div>
    <ion-content class="sm__content ion-padding-start ion-padding-end ion-padding-bottom">
      <form [formGroup]="this.form">
        <app-ux-radio-group>
          <ion-list>
            <ion-radio-group (ionChange)="this.select($event)" formControlName="radio">
              <div class="container" *ngFor="let item of this.data; let last = last">
                <ion-item>
                  <ion-label>{{ item[this.keyName] }}</ion-label>
                  <ion-radio mode="md" slot="start" [value]="item"></ion-radio>
                </ion-item>
                <div class="list-divider" *ngIf="!last"></div>
              </div>
            </ion-radio-group>
          </ion-list>
        </app-ux-radio-group>
      </form>
    </ion-content>
  `,
  styleUrls: ['./select-modal-new.component.scss'],
})
export class SelectModalNewComponent implements OnInit {
  constructor(private modalController: ModalController, private formBuilder: FormBuilder) {}
  title = '';
  data = [];
  keyName = '';
  valueName = '';
  selected: any;
  form: FormGroup = this.formBuilder.group({
    radio: ['', []],
  });

  ngOnInit() {
    this.setSelected();
  }

  setSelected() {
    this.form.patchValue({
      radio: this.selected,
    });
  }

  select(event: any) {
    this.modalController.dismiss(event.detail.value, 'selected');
  }

  close() {
    this.modalController.dismiss();
  }
}
