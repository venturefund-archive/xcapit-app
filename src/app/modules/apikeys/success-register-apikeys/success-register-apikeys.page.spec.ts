import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessRegisterApikeysPage } from './success-register-apikeys.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SuccessRegisterApikeysPage', () => {
  let component: SuccessRegisterApikeysPage;
  let fixture: ComponentFixture<SuccessRegisterApikeysPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessRegisterApikeysPage ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRegisterApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
