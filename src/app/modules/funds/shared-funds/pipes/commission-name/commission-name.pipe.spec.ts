import { TestBed } from '@angular/core/testing';
import { CommissionNamePipe } from './commission-name.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('CommissionNamePipe', () => {
  const translateService = jasmine.createSpyObj('TranslateService', [
    'instant'
  ]);
  translateService.instant.and.returnValue('to');
  const pipe = new CommissionNamePipe(translateService);
  const testValues = [
    { value: { inversion_to: 1, percentage: 0.2 }, expectedResult: '< 1 BTC' },
    {
      value: { inversion_from: 1, inversion_to: 5, percentage: 0.18 },
      expectedResult: '1 BTC to 5 BTC'
    },
    {
      value: { inversion_from: 100, percentage: 0.04 },
      expectedResult: '> 100 BTC'
    }
  ];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Pipe test', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CommissionNamePipe],
        imports: [TranslateModule.forRoot()]
      });
    });

    it('shoud return expected Name', () => {
      testValues.forEach(element => {
        const value = pipe.transform(element.value);
        expect(value).toBe(element.expectedResult);
      });
    });
  });
});
