import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundSliderNewsCardComponent } from './fund-slider-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FundSliderNewsCardComponent', () => {
  let component: FundSliderNewsCardComponent;
  let fixture: ComponentFixture<FundSliderNewsCardComponent>;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        FundSliderNewsCardComponent
      ],

      imports: [
        IonicModule,
        TranslateModule.forRoot()
      ],
      providers: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FundSliderNewsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when goToNew is called', () => {
    spyOn(window, 'open');
    component.goToWeb('test_slug');
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
