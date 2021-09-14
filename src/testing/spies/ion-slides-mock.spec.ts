export class IonSlidesMock {
  public constructor() {}
  public slideNext = () => Promise.resolve();
  public slidePrev = () => Promise.resolve();
  public lockSwipeToNext = () => Promise.resolve();
  public lockSwipeToPrev = () => Promise.resolve();
}
