import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KycUserPersonalInformationPage } from './kyc-user-personal-information.page';

describe('KycUserBasicInformationStep2Page', () => {
  let component: KycUserPersonalInformationPage;
  let fixture: ComponentFixture<KycUserPersonalInformationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KycUserPersonalInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KycUserPersonalInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
