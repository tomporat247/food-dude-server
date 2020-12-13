export class FoodDudeError extends Error {
  public isFoodDudeError: boolean;

  constructor(msg, public status: number, public originalError: any = undefined) {
    super(msg);
    this.isFoodDudeError = true;
  }
}
