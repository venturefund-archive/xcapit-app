import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactLicensePage } from './contact-license.page';

describe('ContactLicensePage', () => {
  let component: ContactLicensePage;
  let fixture: ComponentFixture<ContactLicensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactLicensePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactLicensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
