import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutInvestorProfilesPage } from './about-investor-profiles.page';

describe('AboutInvestorProfilesPage', () => {
  let component: AboutInvestorProfilesPage;
  let fixture: ComponentFixture<AboutInvestorProfilesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutInvestorProfilesPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutInvestorProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
