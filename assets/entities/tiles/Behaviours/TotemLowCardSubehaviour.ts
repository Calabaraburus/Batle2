import { TotemCardSubehaviour } from "./TotemCardSubehaviour";

export class TotemLowCardSubehaviour extends TotemCardSubehaviour {
  protected lvlTile = "totemLow";
  prepare(): boolean {
    super.prepare();
    return true;
  }
}
