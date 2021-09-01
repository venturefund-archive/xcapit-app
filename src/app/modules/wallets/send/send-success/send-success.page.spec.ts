import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendSuccessPage } from './send-success.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SendSuccessPage', () => {
  let component: SendSuccessPage;
  let fixture: ComponentFixture<SendSuccessPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendSuccessPage],
      imports: [IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
