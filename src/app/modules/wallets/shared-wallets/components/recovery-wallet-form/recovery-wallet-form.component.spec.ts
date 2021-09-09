import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryWalletFormComponent } from './recovery-wallet-form.component';

describe('RecoveryWalletFormComponent', () => {
  let component: RecoveryWalletFormComponent;
  let fixture: ComponentFixture<RecoveryWalletFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecoveryWalletFormComponent],
        imports: [IonicModule.forRoot()],
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
