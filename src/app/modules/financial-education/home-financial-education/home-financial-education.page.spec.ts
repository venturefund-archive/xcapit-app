import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomeFinancialEducationPage } from './home-financial-education.page';

describe('HomeFinancialEducationPage', () => {
  let component: HomeFinancialEducationPage;
  let fixture: ComponentFixture<HomeFinancialEducationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeFinancialEducationPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeFinancialEducationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
