export class FoodDudeError extends Error {
  public isFoodDudeError: boolean;

  constructor(msg) {
    super(msg);
    this.isFoodDudeError = true;
  }
}
