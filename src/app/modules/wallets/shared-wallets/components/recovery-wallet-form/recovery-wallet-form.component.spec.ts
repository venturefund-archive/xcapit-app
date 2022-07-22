import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RecoveryWalletFormComponent } from './recovery-wallet-form.component';

describe('RecoveryWalletFormComponent', () => {
  let component: RecoveryWalletFormComponent;
  let fixture: ComponentFixture<RecoveryWalletFormComponent>;
  let formGroupDirectiveMock: any;

  beforeEach(
    waitForAsync(() => {
      formGroupDirectiveMock = { form: { get: () => null } };
      TestBed.configureTestingModule({
        declarations: [RecoveryWalletFormComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryWalletFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
