import { AssassinCardSubehaviour } from "./AssassinCardSubehaviour";

export class AssassinLowCardSubehaviour extends AssassinCardSubehaviour {
  protected lvlTile = "assassinLow";
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
