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
import { TranslateService } from '@ngx-translate/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
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
  @Input() id: any;
  @Input() alias: any;
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
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.form.patchValue(this.alias);
  }

  handleSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.apiApikeysService.crud
        .update(this.form.value)
        .subscribe(
          () => this.success(),
          () => this.error()
        );
    } else {
      this.form.markAllAsTouched();
    }
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text)
    });
  }

  close() {
    this.modalController.dismiss();
  }

  success() {
    this.close();
  }

  error() {
    this.close();
    this.showToast('apikeys.edit_modal.edit_error.default');
  }


}
