export class FoodDudeError extends Error {
  public isFoodDudeError: boolean;

  constructor(msg, public originalError: any) {
    super(msg);
    this.isFoodDudeError = true;
  }
}
