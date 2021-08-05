import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPhraseCardComponent } from './recovery-phrase-card.component';

describe('RecoveryPhraseCardComponent', () => {
  let component: RecoveryPhraseCardComponent;
  let fixture: ComponentFixture<RecoveryPhraseCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseCardComponent],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseCardComponent);
      component = fixture.componentInstance;
      component.phrase = [];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sortPhrase if ordered is true', () => {
    const spy = spyOn(component, 'sortPhrase');
    component.ordered = true;
    fixture.detectChanges();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call sortPhrase if ordered is false', () => {
    const spy = spyOn(component, 'sortPhrase');
    component.ordered = false;
    fixture.detectChanges();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should sort phraseCopy on sortPhrase', () => {
    const spy = spyOn(component.phraseCopy, 'sort');
    component.sortPhrase();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when useValue called', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.useValue('');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
