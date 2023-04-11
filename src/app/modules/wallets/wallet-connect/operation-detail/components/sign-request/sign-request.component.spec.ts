import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import * as moment from 'moment';

import { SignRequestComponent } from './sign-request.component';

const dateInfo = {
  date: moment().utc().format('DD/MM/YYYY'),
  time: moment().utc().format('HH:mm'),
};

describe('SignRequestComponent', () => {
  let component: SignRequestComponent;
  let fixture: ComponentFixture<SignRequestComponent>;
  const message = document.createElement('div');

  beforeEach(waitForAsync(() => {
    message.appendChild(document.createTextNode('Hello World'));

    TestBed.configureTestingModule({
      declarations: [SignRequestComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SignRequestComponent);
    component = fixture.componentInstance;
    component.message = message;
    component.dateInfo = dateInfo;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
