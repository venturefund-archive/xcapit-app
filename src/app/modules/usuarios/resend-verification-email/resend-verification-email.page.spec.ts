import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResendVerificationEmailPage } from './resend-verification-email.page';

describe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendVerificationEmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResendVerificationEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
