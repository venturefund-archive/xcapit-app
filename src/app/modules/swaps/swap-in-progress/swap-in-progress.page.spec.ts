import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { SwapInProgressPage } from './swap-in-progress.page';

const testData = {
  image:"assets/img/swaps/swap-in-progress.svg",
  urlClose:'/tabs/wallets',
  textPrimary: 'swaps.swap_in_progress.textPrimary', 
  textSecondary:'swaps.swap_in_progress.textSecondary',
  namePrimaryAction:'swaps.swap_in_progress.buttonText',
  urlPrimaryAction:'/tabs/wallets',
}

describe('SwapInProgressPage', () => {
  let component: SwapInProgressPage;
  let fixture: ComponentFixture<SwapInProgressPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapInProgressPage ],
      imports: [IonicModule.forRoot()],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SwapInProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });

});
