import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessRegisterApikeysBeginnerPage } from './success-register-apikeys-beginner.page';

describe('SuccessRegisterApikeysBeginnerPage', () => {
  let component: SuccessRegisterApikeysBeginnerPage;
  let fixture: ComponentFixture<SuccessRegisterApikeysBeginnerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessRegisterApikeysBeginnerPage],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRegisterApikeysBeginnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
