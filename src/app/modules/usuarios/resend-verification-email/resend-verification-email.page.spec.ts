import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';

import { ResendVerificationEmailPage } from './resend-verification-email.page';

fdescribe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;
  let apiUsuariosMock: any;

  beforeEach(
    waitForAsync(() => {
      apiUsuariosMock = {
        crud: {
          sendEmailValidation: (data: any) => of(data)
        }
      };
      TestBed.configureTestingModule({
        declarations: [ResendVerificationEmailPage],
        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'users/login', component: DummyComponent },
            { path: 'tickets/create-ticket', component: DummyComponent },
          ]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          TrackClickUnauthDirective,
          { provide: ApiUsuariosService, useValue: apiUsuariosMock }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ResendVerificationEmailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resendEmail on ionViewWillEnter', () => {
    const spy = spyOn(component, 'resendEmail');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  
});
