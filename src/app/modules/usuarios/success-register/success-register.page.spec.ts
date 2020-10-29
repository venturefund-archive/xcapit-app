import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessRegisterPage } from './success-register.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SuccessRegisterPage', () => {
  let component: SuccessRegisterPage;
  let fixture: ComponentFixture<SuccessRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessRegisterPage ],
      imports: [IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
