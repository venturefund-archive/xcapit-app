import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwapTermsAndConditionsPage } from './swap-terms-and-conditions.page';

describe('SwapTermsAndConditionsPage', () => {
  let component: SwapTermsAndConditionsPage;
  let fixture: ComponentFixture<SwapTermsAndConditionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapTermsAndConditionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwapTermsAndConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
