import { BerserkCardSubehaviour } from "./BerserkCardSubehaviour";

export class BerserkLowCardSubehaviour extends BerserkCardSubehaviour {
  protected lvlTile = 1;
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
