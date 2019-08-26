import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DebugElement } from '@angular/core';

export class TrackClickDirectiveTestHelper<T> {
  fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  getByElementByName(element: string, name: string) {
    return this.fixture.debugElement.query(
      By.css(`${element}[name="${name}"]`)
    );
  }

  getElement(element: string) {
    return this.fixture.debugElement.query(By.css(`${element}`));
  }

  getDirective(element: DebugElement): TrackClickDirective {
    return element.injector.get(TrackClickDirective) as TrackClickDirective;
  }

  getAllElementsWithTheDirective() {
    return this.fixture.debugElement.queryAll(
      By.directive(TrackClickDirective)
    );
  }

  getFirstElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[0] : null;
  }

  getLastElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[all.length - 1] : null;
  }
}
