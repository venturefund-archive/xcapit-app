import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessRegisterApikeysPage } from './success-register-apikeys.page';

describe('SuccessRegisterApikeysPage', () => {
  let component: SuccessRegisterApikeysPage;
  let fixture: ComponentFixture<SuccessRegisterApikeysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessRegisterApikeysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRegisterApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
