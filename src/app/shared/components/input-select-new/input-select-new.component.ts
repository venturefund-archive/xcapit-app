import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SelectModalNewComponent } from '../select-modal-new/select-modal-new.component';

@Component({
  selector: 'app-input-select-new',
  template: `
    <div class="uxselect">
      <ion-label class="ux-font-text-xs">{{ this.label }}</ion-label>
      <ion-item (click)="this.openModal($event)" class="uxselect__item">
        <img *ngIf="this.imageKey" class="uxselect__item__logo" [src]="this.control.value[this.imageKey]" alt="logo" />
        <ion-icon
          *ngIf="this.iconKey"
          class="uxselect__item__logo"
          [name]="this.control.value[this.iconKey]"
        ></ion-icon>
        <ion-label class="uxselect__label">{{ this.control.value[this.valueKey] }}</ion-label>
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
  `,
  styleUrls: ['./input-select-new.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputSelectNewComponent implements OnInit {
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
  constructor(private modalController: ModalController, private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
    console.log(this.control.value[this.imageKey]);
    console.log(this.control);
  }

  async openModal(event: UIEvent | undefined) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const modal = await this.modalController.create({
      component: SelectModalNewComponent,
      componentProps: {
        title: this.modalTitle,
        data: this.data,
        keyName: this.key,
        valueName: this.valueKey,
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

  setSelectedValue(value: any, patch = true) {
    if (patch) this.control.patchValue(value);
  }
}
