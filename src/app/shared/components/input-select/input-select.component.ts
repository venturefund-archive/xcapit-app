import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SelectModalNewComponent } from '../select-modal-new/select-modal-new.component';

@Component({
  selector: 'app-input-select',
  template: `
    <div [appSelectStyle]="this.selectorStyle">
      <div class="uxselect">
        <ion-label class="ux-font-text-xs">{{ this.label }}</ion-label>
        <ion-item (click)="this.openModal()" class="uxselect__item">
          <img
            *ngIf="this.imageKey"
            class="uxselect__item__logo"
            [src]="this.control.value[this.imageKey]"
            alt="logo"
          />
          <ion-icon
            *ngIf="this.iconKey"
            class="uxselect__item__logo"
            [name]="this.control.value[this.iconKey]"
          ></ion-icon>
          <ion-label *ngIf="!this.control.value && this.placeholder" class="ux-font-text-xs uxselect__placeholder">{{
            this.placeholder
          }}</ion-label>
          <ion-label *ngIf="this.control.value" class="uxselect__label">{{
            this.translated ? (this.control.value[this.valueKey] | translate) : this.control.value[this.valueKey]
          }}</ion-label>
          <ion-input
            type="hidden"
            class="input"
            mode="md"
            [formControlName]="this.controlName"
            [placeholder]="this.placeholder"
            [readonly]="true"
          >
          </ion-input>
          <ion-icon class="uxselect__item__arrow_icon" item-end name="ux-down" color="uxdark"></ion-icon>
        </ion-item>
        <app-errors-form-item [controlName]="this.controlName"></app-errors-form-item>
      </div>
    </div>
  `,
  styleUrls: ['./input-select.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputSelectComponent implements OnInit {
  control: AbstractControl;
  @Input() label = '';
  @Input() modalTitle = '';
  @Input() placeholder = '';
  @Input() controlName = '';
  @Input() data = [];
  @Input() key: string;
  @Input() valueKey: string;
  @Input() iconKey: string;
  @Input() imageKey: string;
  @Input() selectorStyle = 'classic';
  @Input() translated = false;
  constructor(private modalController: ModalController, private formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.formGroupDirective.form.get(this.controlName);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: SelectModalNewComponent,
      componentProps: {
        title: this.modalTitle,
        data: this.data,
        key: this.key,
        valueKey: this.valueKey,
        translated: this.translated,
        selected: this.control.value,
      },
      cssClass: 'ux-routeroutlet-modal generic-modal',
      swipeToClose: false,
    });
    await modal.present();

    const data = await modal.onDidDismiss();
    if (data.role === 'selected') {
      this.setSelectedValue(data.data);
    }
  }

  setSelectedValue(value: any) {
    this.control.patchValue(value);
  }
}
