import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApiApikeysService } from '../../services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-apikeys-edit-modal',
  template: `
    <div class="change_alias">
      <div class="change_alias__header">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-14">
          {{ 'apikeys.edit_modal.title' | translate }}
        </ion-text>
      </div>
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <app-ux-input
          controlName="alias"
          type="text"
          inputmode="text"
          class="change_alias__input"
        >
        </app-ux-input>

        <div class="modal_footer">
          <div class="change_alias__description">
            <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">
              {{ 'apikeys.edit_modal.description' | translate }}
            </ion-text>
          </div>

          <div class="change_alias__submit">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Submit"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'apikeys.edit_modal.button_submit' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./apikeys-edit-modal.component.scss'],
})
export class ApikeysEditModalComponent implements OnInit {
  @Input() data: any;
  control: AbstractControl;
  form: FormGroup = this.formBuilder.group({
    alias: [
      '',
      [
        Validators.required,
        Validators.maxLength(23),
        CustomValidators.patternValidator(
          /^[a-zA-Z0-9]+$/,
          CustomValidatorErrors.hasSpecialCharacter
        ),
      ],
    ],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form.patchValue(this.data);
  }

  handleSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.apiApikeysService.updateData(data);
      //this.navController.navigateForward(['/apikeys/success-register']);
      this.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
