import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RecoveryWordComponent } from '../recovery-word/recovery-word.component';

import { RecoveryPhraseCardComponent } from './recovery-phrase-card.component';

describe('RecoveryPhraseCardComponent', () => {
  let component: RecoveryPhraseCardComponent;
  let fixture: ComponentFixture<RecoveryPhraseCardComponent>;
  let toEnableComponent: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseCardComponent, RecoveryWordComponent],
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

  it('should emit event when useValue is called', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.useValue('');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should enable button if isActivated is true when enable is called', () => {
    component.phraseCopy = ['test1', 'test2'];
    fixture.detectChanges();
    component.enable('test1');
    toEnableComponent = component.recoveryWordComponents.find((wordComponent) => wordComponent.word === 'test1');
    expect(toEnableComponent.isActivated).toBeTrue();
  });
});
