import { CatapultCardSubehaviour } from "./СatapultCardSubehaviour";

export class CatapultLowCardSubehaviour extends CatapultCardSubehaviour {
  protected lvlTile = "catapultLow";
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
