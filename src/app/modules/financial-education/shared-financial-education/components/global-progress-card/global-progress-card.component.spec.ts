import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { GlobalProgressCardComponent } from './global-progress-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { rawEducationData } from '../../fixtures/rawEducationData';
import { rawEducationProgressData } from '../../fixtures/rawEducationProgressData';

fdescribe('GlobalProgressCardComponent', () => {
  let component: GlobalProgressCardComponent;
  let fixture: ComponentFixture<GlobalProgressCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GlobalProgressCardComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(GlobalProgressCardComponent);
      component = fixture.componentInstance;
      component.modules = rawEducationProgressData;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card_state_0 if progress is 0', async () => {
    component.calculateProgressPercentage();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('.gpc__card__accordion__item__content ion-text.ux-font-text-xxs')
    );
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.home.global_progress.card_state_0');
  });

  it('should render card_state_25 if progress is 25', () => {
    rawEducationProgressData[0].status = 'completed';
    component.calculateProgressPercentage();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('.gpc__card__accordion__item__content ion-text.ux-font-text-xxs')
    );
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.home.global_progress.card_state_25');
  });

  it('should render card_state_50 if progress is 50', () => {
    rawEducationProgressData[0].status = 'completed';
    rawEducationProgressData[1].status = 'completed';
    component.calculateProgressPercentage();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('.gpc__card__accordion__item__content ion-text.ux-font-text-xxs')
    );
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.home.global_progress.card_state_50');
  });

  it('should render card_state_75 if progress is 75', () => {
    rawEducationProgressData[0].status = 'completed';
    rawEducationProgressData[1].status = 'completed';
    rawEducationProgressData[2].status = 'completed';
    component.calculateProgressPercentage();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('.gpc__card__accordion__item__content ion-text.ux-font-text-xxs')
    );
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.home.global_progress.card_state_75');
  });

  it('should render card_state_100 if progress is 100', () => {
    rawEducationProgressData[0].status = 'completed';
    rawEducationProgressData[1].status = 'completed';
    rawEducationProgressData[2].status = 'completed';
    rawEducationProgressData[3].status = 'completed';
    component.calculateProgressPercentage();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('.gpc__card__accordion__item__content ion-text.ux-font-text-xxs')
    );
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.home.global_progress.card_state_100');
  });

  it('should render the list of modules', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.modules.length).toEqual(4);
  });
});
