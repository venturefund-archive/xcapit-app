import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UxSelectModalComponent } from '../ux-select-modal/ux-select-modal.component';
@Component({
  selector: 'app-ux-input-select',
  template: `
    <div class="uxselect">
      <ion-label class="ux-font-text-xs">{{ this.label }}</ion-label>
      <ion-item class="uxselect__item">
        <ion-input
          mode="md"
          [formControlName]="this.controlName"
          [placeholder]="this.placeholder"
          [readonly]="true"
          (click)="this.openModal($event)"
        >
        </ion-input>
        <ion-icon class="uxselect__item__arrow_icon" item-end name="ux-down" color="uxdark"></ion-icon>
      </ion-item>
      <app-errors-form-item [controlName]="this.controlName"></app-errors-form-item>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./ux-input-select.component.scss'],
})
export class UxInputSelectComponent implements OnInit {
  @Input() label = '';
  @Input() modalTitle = '';
  @Input() placeholder = '';
  @Input() controlName = '';
  @Input() data = [];
  @Input() keyName = '';
  @Input() valueName = '';
  control: AbstractControl;

  constructor(private modalController: ModalController, private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
    this.control.valueChanges.subscribe((value) => this.setSelectedValue(value, false));
  }

  async openModal(event: UIEvent | undefined) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.modalTitle,
        data: this.data,
        keyName: this.keyName,
        valueName: this.valueName,
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
    this.control.patchValue(value);
  }
}
