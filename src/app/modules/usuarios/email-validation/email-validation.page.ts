import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-email-validation',
  template: `
    <ion-content class="ion-padding">
      <div
        *ngIf="!this.isValidEmail && !this.isValidating"
        class="ion-text-center"
      >
        <h3>
          No pudimos verificar el Email!
        </h3>
        <div class="ion-padding-top">
          Intenta enviar nuevamente el email de validación.
        </div>
        <div class="auth-button ion-padding-top">
          <ion-button
            expand="full"
            size="large"
            type="submit"
            [disabled]="this.submitButtonService.isDisabled | async"
            (click)="this.sendEmailValidation()"
          >
            <ion-icon slot="start" name="send"></ion-icon>
            Enviar
          </ion-button>
        </div>
        <div class="ion-text-left ion-padding-top">
          <ion-button
            fill="clear"
            size="small"
            type="button"
            routerDirection="back"
            [routerLink]="['/users/register']"
          >
            Volver al registro
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./email-validation.page.scss']
})
export class EmailValidationPage implements OnInit, OnDestroy {
  emailValidationSubscription: Subscription;

  emailValidationToken: string;

  isValidEmail = false;

  isValidating = true;

  constructor(
    public submitButtonService: SubmitButtonService,
    private route: ActivatedRoute,
    private apiUsuario: ApiUsuariosService,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.emailValidation();
  }

  ngOnDestroy() {
    this.emailValidationSubscription.unsubscribe();
  }

  emailValidation() {
    this.emailValidationSubscription = this.route.params
      .pipe(
        filter((params: Params) => params.emailValidationToken),
        tap(
          (params: Params) =>
            (this.emailValidationToken = params.emailValidationToken)
        ),
        switchMap(() =>
          this.apiUsuario.emailValidation(this.emailValidationToken)
        )
      )
      .subscribe({
        next: data => this.handleEmailValidationResponse(data),
        error: () => (this.isValidating = false)
      });
  }

  private handleEmailValidationResponse(data: any) {
    this.isValidating = false;
    this.isValidEmail = data.isValid;
    if (this.isValidEmail) {
      this.navController
        .navigateForward(['/usuarios/login'], { replaceUrl: true })
        .then(() =>
          this.toastService.showToast({
            message: 'Email Verificado correctamente!'
          })
        );
    }
  }

  sendEmailValidation() {
    if (this.emailValidationToken && !this.isValidEmail) {
      this.apiUsuario
        .sendEmailValidation(this.emailValidationToken)
        .subscribe();
    }
  }
}
