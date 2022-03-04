import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { SignRequestComponent } from './sign-request.component';

const dateInfo = {
  date: moment().utc().format('DD/MM/YYYY'),
  time: moment().utc().format('HH:mm'),
}

const message = 'Hello World';

describe('SignRequestComponent', () => {
  let component: SignRequestComponent;
  let fixture: ComponentFixture<SignRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignRequestComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
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
